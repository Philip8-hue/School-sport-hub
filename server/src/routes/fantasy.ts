import {sportConfigs,configFor,validateRoster,scoreOther,fantasyLabels} from '../lib/fantasy-sports.js';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
export const fantasyRouter=Router(), fantasyAdminRouter=Router();
fantasyRouter.use(requireAuth); fantasyAdminRouter.use(requireAuth,requireRole('ADMIN'));
for(const router of [fantasyRouter,fantasyAdminRouter])router.use((_r,s,n)=>{s.setHeader('Cache-Control','private, no-store');n();});
const id=z.number().int().positive();
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
const fail=(message:string,status=400):never=>{throw new Failure(status,message);};
const endpoint=(fn:(r:Request,s:Response)=>Promise<unknown>)=>async(r:Request,s:Response,n:NextFunction)=>{try{await fn(r,s);}catch(e){if(e instanceof Failure){s.status(e.status).json({error:e.message});return;}if(e instanceof z.ZodError){s.status(400).json({error:'Check all fields and numeric values.',details:e.flatten()});return;}if(['P2034','P2002'].includes((e as any).code)){s.status(409).json({error:'Another change was saved. Refresh and try again.'});return;}n(e);}};
export const defaultRules={appearance:1,sixtyMinutes:1,goalGK:6,goalDEF:6,goalMID:5,goalFWD:4,assist:3,cleanGK:4,cleanDEF:4,cleanMID:1,saveThree:1,yellow:-1,red:-3,missedPenalty:-2,ownGoal:-2,concededTwo:-1,captain:2};
type Catalog={id:number;name:string;clubId:number;club:string;position:string;price:number};
const parsed=(round:any)=>({...round,rules:JSON.parse(round.rules),catalog:JSON.parse(round.catalog),fixtureIds:JSON.parse(round.fixtureIds)});
export function score(position:string,stats:any,rules:typeof defaultRules){if(!stats.minutes)return 0;return rules.appearance+(stats.minutes>=60?rules.sixtyMinutes:0)+stats.goals*rules[('goal'+position) as keyof typeof rules]+stats.assists*rules.assist+(stats.minutes>=60&&stats.goalsConceded===0?(rules[('clean'+position) as keyof typeof rules]||0):0)+(position==='GK'?Math.floor(stats.saves/3)*rules.saveThree:0)+stats.yellowCards*rules.yellow+stats.redCards*rules.red+stats.penaltiesMissed*rules.missedPenalty+stats.ownGoals*rules.ownGoal+(['GK','DEF'].includes(position)?Math.floor(stats.goalsConceded/2)*rules.concededTwo:0);}
const txOptions={isolationLevel:'Serializable' as const,timeout:20000};
fantasyRouter.get('/',endpoint(async(r,s)=>{
 const rounds=await prisma.fantasyRound.findMany({orderBy:{deadline:'desc'}}); const entries=await prisma.fantasyEntry.findMany({where:{userId:r.user!.id}});
 const rankings=await prisma.fantasyEntry.findMany({where:{round:{status:'PUBLISHED'}},select:{roundId:true,name:true,total:true,userId:true},orderBy:[{total:'desc'},{id:'asc'}]});
 const fixtures=await prisma.fixture.findMany({where:{id:{in:[...new Set(rounds.flatMap(r=>JSON.parse(r.fixtureIds) as number[]))]}},include:{homeClub:true,awayClub:true,result:true}});
 s.json({sportConfigs,labels:fantasyLabels,fixtures,serverTime:new Date(),rounds:rounds.map(parsed),entries,rankings:rankings.map(({userId,...v})=>({...v,mine:userId===r.user!.id}))});
}));
fantasyRouter.put('/rounds/:id/team',endpoint(async(r,s)=>{
 const body=z.object({name:z.string().trim().min(2).max(50),squad:z.array(id).min(1).max(15),starters:z.array(id).min(1).max(11),captainId:id}).strict().parse(r.body);
 const saved=await prisma.$transaction(async tx=>{
  const round=await tx.fantasyRound.findUniqueOrThrow({where:{id:Number(r.params.id)}});
  if(round.status!=='OPEN'||Date.now()>=round.deadline.getTime())fail('The deadline has passed. This round is locked.',409);
  const liveFixtures=await tx.fixture.findMany({where:{id:{in:JSON.parse(round.fixtureIds)}}});
  if(liveFixtures.length!==JSON.parse(round.fixtureIds).length||liveFixtures.some(f=>f.startsAt.getTime()<=Date.now()||f.status!=='SCHEDULED'))fail('A round fixture has started or changed status. Selections are locked.',409);
  const config=configFor(round.sport);
  const catalog:Catalog[]=JSON.parse(round.catalog), selected=body.squad.map(i=>catalog.find(p=>p.id===i));
  if(body.squad.length!==config.squad||new Set(body.squad).size!==config.squad||selected.some(p=>!p))fail(`Choose ${config.squad} different eligible players.`);
  const squad=selected as Catalog[];
  if(squad.reduce((a,p)=>a+p.price,0)>round.budget+0.00001)fail('Your squad exceeds the round budget.');
  if(squad.some(p=>squad.filter(x=>x.clubId===p.clubId).length>config.clubLimit))fail(`Choose no more than ${config.clubLimit} players from one club.`);
  if(body.starters.length!==config.starters||new Set(body.starters).size!==config.starters||body.starters.some(i=>!body.squad.includes(i))||!body.starters.includes(body.captainId))fail(`Choose ${config.starters} different starters and a captain among them.`);
  const rosterError=validateRoster(round.sport,squad,body.starters);if(rosterError)fail(rosterError);
  // Touch the round to serialize submission against admin changes and publication.
  await tx.fantasyRound.update({where:{id:round.id},data:{updatedAt:new Date()}});
  if(Date.now()>=round.deadline.getTime())fail('The deadline has passed.',409);
  const data={name:body.name,squad:JSON.stringify(body.squad),starters:JSON.stringify(body.starters),captainId:body.captainId};
  return tx.fantasyEntry.upsert({where:{roundId_userId:{roundId:round.id,userId:r.user!.id}},create:{...data,roundId:round.id,userId:r.user!.id},update:data});
 },txOptions);s.json(saved);
}));
fantasyAdminRouter.get('/',endpoint(async(_r,s)=>{s.json({defaultRules,sportConfigs,labels:fantasyLabels,rounds:(await prisma.fantasyRound.findMany({include:{stats:true,_count:{select:{entries:true}}},orderBy:{deadline:'desc'}})).map(parsed),players:await prisma.player.findMany({where:{sport:{in:Object.keys(sportConfigs)}},include:{club:true},orderBy:{name:'asc'}}),fixtures:await prisma.fixture.findMany({where:{sport:{in:Object.keys(sportConfigs)}},include:{homeClub:true,awayClub:true,result:true},orderBy:{startsAt:'desc'}})});}));
const roundSchema=z.object({name:z.string().trim().min(2).max(80),sport:z.enum(['Male Football','Female Football','Male Basketball','Female Basketball','Volleyball']),deadline:z.iso.datetime(),budget:z.number().int().min(75).max(500),fixtureIds:z.array(id).min(1).max(50),rules:z.record(z.string(),z.number().int().min(-20).max(20)),catalog:z.array(z.object({id,position:z.string().min(1).max(10),price:z.number().min(1).max(30)})).min(8).max(500)}).strict();
fantasyAdminRouter.post('/rounds',endpoint(async(r,s)=>{
 const b=roundSchema.parse(r.body);const config=configFor(b.sport);
 const keys=Object.keys(config.rules);if(keys.some(k=>!(k in b.rules))||Object.keys(b.rules).some(k=>!keys.includes(k))||b.rules.captain<1||b.rules.captain>3)fail('Use the scoring fields for this sport and a captain multiplier from 1 to 3.');
 if(b.catalog.length<config.squad||b.catalog.some(p=>!config.positions.includes(p.position)))fail('Check the eligible player count and fantasy positions for this sport.');if(new Set(b.catalog.map(p=>p.id)).size!==b.catalog.length||new Set(b.fixtureIds).size!==b.fixtureIds.length)fail('Remove duplicate players or fixtures.');
 if(new Date(b.deadline).getTime()<=Date.now())fail('Choose a future deadline.');
 const fixtures=await prisma.fixture.findMany({where:{id:{in:b.fixtureIds}}});
 if(fixtures.length!==b.fixtureIds.length||fixtures.some(f=>f.sport!==b.sport||f.status!=='SCHEDULED'||f.startsAt<=new Date(b.deadline)))fail('Every fixture must be scheduled in this competition after the deadline.');
 const players=await prisma.player.findMany({where:{id:{in:b.catalog.map(p=>p.id)}},include:{club:true}});
 if(players.length!==b.catalog.length||players.some(p=>p.sport!==b.sport||!p.clubId))fail('All selected players need a club and the same competition.');
 const catalog=b.catalog.map(p=>{const live=players.find(x=>x.id===p.id)!;return {...p,name:live.name,clubId:live.clubId,club:live.club!.name};});
 for(const [pos,count]of Object.entries(config.required))if(catalog.filter(p=>p.position===pos).length<(count as number))fail('The player pool cannot fill a complete squad. Check positions.');
 s.status(201).json(await prisma.fantasyRound.create({data:{name:b.name,sport:b.sport,deadline:new Date(b.deadline),budget:b.budget,rules:JSON.stringify(b.rules),catalog:JSON.stringify(catalog),fixtureIds:JSON.stringify(b.fixtureIds)}}));
}));
fantasyAdminRouter.patch('/rounds/:id/deadline',endpoint(async(r,s)=>{
 const {deadline}=z.object({deadline:z.iso.datetime()}).parse(r.body);
 await prisma.$transaction(async tx=>{const round=await tx.fantasyRound.findUniqueOrThrow({where:{id:Number(r.params.id)}});if(round.status!=='OPEN'||round.deadline.getTime()<=Date.now()||new Date(deadline).getTime()<=Date.now())fail('Locked rounds cannot be reopened.',409);const fixtures=await tx.fixture.findMany({where:{id:{in:JSON.parse(round.fixtureIds)}}});if(fixtures.some(f=>f.startsAt<=new Date(deadline)))fail('The deadline must precede every fixture.');await tx.fantasyRound.update({where:{id:round.id},data:{deadline:new Date(deadline)}});},txOptions);s.json({saved:true});
}));
fantasyAdminRouter.put('/rounds/:id/stats',endpoint(async(r,s)=>{
 const existing=await prisma.fantasyRound.findUniqueOrThrow({where:{id:Number(r.params.id)}});const config=configFor(existing.sport);
 const shape:Record<string,z.ZodNumber>={fixtureId:id,playerId:id};for(const [key,max] of Object.entries(config.stats))shape[key]=z.number().int().min(0).max(max as number);
 const b=z.object(shape).strict().parse(r.body);
 const played=config.key==='volleyball'?b.setsPlayed:b.minutes;
 if(!played&&Object.entries(b).some(([k,v])=>!['fixtureId','playerId','minutes','setsPlayed','goalsConceded'].includes(k)&&v>0))fail('A player who did not play cannot have match events.');
 await prisma.$transaction(async tx=>{const round=await tx.fantasyRound.findUniqueOrThrow({where:{id:Number(r.params.id)}});if(round.status==='PUBLISHED'||Date.now()<round.deadline.getTime())fail('Enter statistics after the deadline and before publishing.',409);const catalog:Catalog[]=JSON.parse(round.catalog),p=catalog.find(p=>p.id===b.playerId);const f=await tx.fixture.findUniqueOrThrow({where:{id:b.fixtureId},include:{result:true}});if(!JSON.parse(round.fixtureIds).includes(f.id)||!p||![f.homeClubId,f.awayClubId].includes(p.clubId))fail('This player is not eligible for this fixture.');if(f.status!=='COMPLETED'||!f.result)fail('Save the official finished match result first.');if(f.sport!==round.sport)fail('The fixture competition has changed.');if(config.key==='football'){const conceded=p!.clubId===f.homeClubId?f.result!.awayScore:f.result!.homeScore;if(b.goalsConceded!==conceded)fail('Goals conceded must match the official result.');const scored=p!.clubId===f.homeClubId?f.result!.homeScore:f.result!.awayScore;if(b.goals>scored||b.assists>scored)fail('Goals and assists cannot exceed the team score.');}else if(config.key==='basketball'&&b.points>(p!.clubId===f.homeClubId?f.result!.homeScore:f.result!.awayScore))fail('Player points cannot exceed the official team score.');else if(config.key==='volleyball'&&b.setsPlayed>f.result!.homeScore+f.result!.awayScore)fail('Sets played cannot exceed the official match length.');await tx.fantasyRound.update({where:{id:round.id},data:{updatedAt:new Date()}});await tx.fantasyMatchStat.upsert({where:{roundId_fixtureId_playerId:{roundId:round.id,fixtureId:b.fixtureId,playerId:b.playerId}},create:{roundId:round.id,fixtureId:b.fixtureId,playerId:b.playerId,stats:JSON.stringify(b)},update:{stats:JSON.stringify(b)}});},txOptions);s.json({saved:true});
}));
fantasyAdminRouter.post('/rounds/:id/publish',endpoint(async(r,s)=>{
 await prisma.$transaction(async tx=>{const round=await tx.fantasyRound.findUniqueOrThrow({where:{id:Number(r.params.id)},include:{stats:true,entries:true}});if(round.status==='PUBLISHED'||Date.now()<round.deadline.getTime())fail('This round is not ready to publish.',409);const catalog:Catalog[]=JSON.parse(round.catalog),fixtureIds:number[]=JSON.parse(round.fixtureIds),rules=JSON.parse(round.rules);const fixtures=await tx.fixture.findMany({where:{id:{in:fixtureIds}},include:{result:true}});if(fixtures.length!==fixtureIds.length||fixtures.some(f=>f.sport!==round.sport||f.status!=='COMPLETED'||!f.result))fail('Every round fixture must have a finished official result.');for(const f of fixtures){for(const p of catalog.filter(p=>[f.homeClubId,f.awayClubId].includes(p.clubId))){if(!round.stats.some(t=>t.fixtureId===f.id&&t.playerId===p.id))fail('Enter statistics for every eligible player in each fixture, including zero minutes for unused players.');}for(const clubId of [f.homeClubId,f.awayClubId]){const teamStats=round.stats.filter(t=>t.fixtureId===f.id&&catalog.find(p=>p.id===t.playerId)?.clubId===clubId).map(t=>JSON.parse(t.stats));const actual=clubId===f.homeClubId?f.result!.homeScore:f.result!.awayScore;if(configFor(round.sport).key==='basketball'&&teamStats.reduce((a,t)=>a+t.points,0)>actual)fail('Combined player points exceed the official team score.');if(configFor(round.sport).key==='football'&&(teamStats.reduce((a,t)=>a+t.goals,0)>actual||teamStats.reduce((a,t)=>a+t.assists,0)>actual))fail('Combined player goals or assists exceed the official score.');}for(const t of round.stats.filter(t=>t.fixtureId===f.id)){const p=catalog.find(p=>p.id===t.playerId)!;if(configFor(round.sport).key==='volleyball'&&JSON.parse(t.stats).setsPlayed>f.result!.homeScore+f.result!.awayScore)fail('The result changed. Check sets played.');if(configFor(round.sport).key==='football'&&JSON.parse(t.stats).goalsConceded!==(p.clubId===f.homeClubId?f.result!.awayScore:f.result!.homeScore))fail('The result changed. Update player statistics before publishing.');}}
 for(const e of round.entries){const starters:number[]=JSON.parse(e.starters);const breakdown=JSON.parse(e.squad).map((playerId:number)=>{const p=catalog.find(p=>p.id===playerId)!;const matches=round.stats.filter(t=>t.playerId===playerId).map(t=>({fixtureId:t.fixtureId,stats:JSON.parse(t.stats),points:configFor(round.sport).key==='football'?score(p.position,JSON.parse(t.stats),rules):scoreOther(round.sport,JSON.parse(t.stats),rules)}));const multiplier=starters.includes(playerId)?(e.captainId===playerId?rules.captain:1):0;return {playerId,name:p.name,multiplier,matches,points:matches.reduce((a,t)=>a+t.points,0)*multiplier};});await tx.fantasyEntry.update({where:{id:e.id},data:{total:breakdown.reduce((a:number,t:any)=>a+t.points,0),breakdown:JSON.stringify(breakdown)}});}
 await tx.fantasyRound.update({where:{id:round.id},data:{status:'PUBLISHED',publishedAt:new Date()}});},txOptions);s.json({published:true});
}));
