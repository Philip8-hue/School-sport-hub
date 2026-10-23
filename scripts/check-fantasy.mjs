import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawn} from 'node:child_process';import Database from 'better-sqlite3';import bcrypt from 'bcryptjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fantasy-check-')),file=path.join(dir,'test.db');const db=new Database(file);for(const m of fs.readdirSync('prisma/migrations').sort())if(fs.existsSync(`prisma/migrations/${m}/migration.sql`))db.exec(fs.readFileSync(`prisma/migrations/${m}/migration.sql`,'utf8'));
for(const [email,role]of [['admin@test.local','ADMIN'],['fan@test.local','USER'],['other@test.local','USER']])db.prepare('INSERT INTO User(email,name,passwordHash,role,updatedAt) VALUES(?,?,?,?,?)').run(email,role,await bcrypt.hash('Test-password-123',4),role,new Date().toISOString());
const host=process.argv.includes('--preview')?'127.0.0.2':'127.0.0.1';const base=`http://${host}:5134`,cookies={};let checks=0;const child=spawn(process.execPath,['dist/server/src/index.js'],{env:{...process.env,NODE_ENV:'test',REQUIRE_EMAIL_VERIFICATION:'false',AUTH_TEST_EMAIL_DIR:path.join(dir,'mail'),VERCEL:'0',DATABASE_PROVIDER:'sqlite',DATABASE_URL:'file:'+file,HOST:host,PORT:'5134',JWT_SECRET:'fantasy-tests-need-at-least-32-characters'},stdio:['ignore','pipe','pipe']});let log='';child.stderr.on('data',c=>log+=c);
async function req(method,url,status,body,who='admin'){const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',Origin:base,...(cookies[who]?{Cookie:cookies[who]}:{})},body:body?JSON.stringify(body):undefined});const d=await r.json();assert.equal(r.status,status,`${method} ${url}: ${JSON.stringify(d)}`);checks++;if(r.headers.get('set-cookie'))cookies[who]=r.headers.get('set-cookie').split(';')[0];return d;}
try{await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);setTimeout(()=>reject(Error(log)),15000).unref();});
await req('GET','/api/fantasy/',401,null,'guest');for(const who of ['admin','other'])await req('POST','/api/auth/login',200,{email:who+'@test.local',password:'Test-password-123'},who);
const newFan=await req('POST','/api/auth/register',201,{email:'fresh-fan@example.test',password:'Fresh-fan-password-123'},'fan');assert.equal(newFan.verificationRequired,false);checks++;await req('GET','/api/admin/fantasy',403,null,'fan');const clubs=[];for(let i=0;i<5;i++)clubs.push(await req('POST','/api/clubs',201,{name:'Club'+i,slug:'fantasy-'+i,sport:'Male Football'}));
const positions=['GK','GK','DEF','DEF','DEF','DEF','DEF','MID','MID','MID','MID','MID','FWD','FWD','FWD'];const players=[];for(let i=0;i<15;i++)players.push(await req('POST','/api/players',201,{name:'Player '+i,sport:'Male Football',position:positions[i],clubId:clubs[i%5].id}));
const fixtures=[];for(let i=0;i<5;i++)fixtures.push(await req('POST','/api/fixtures',201,{sport:'Male Football',homeClubId:clubs[i].id,awayClubId:clubs[(i+1)%5].id,startsAt:'2035-01-02T12:00:00Z'}));
const admin=await req('GET','/api/admin/fantasy',200);const body={name:'Test round',sport:'Male Football',deadline:'2035-01-01T12:00:00Z',budget:100,rules:admin.defaultRules,fixtureIds:fixtures.map(f=>f.id),catalog:players.map(p=>({id:p.id,position:p.position,price:5}))};
await req('POST','/api/admin/fantasy/rounds',400,{...body,rules:{...body.rules,captain:-2}});await req('POST','/api/admin/fantasy/rounds',400,{...body,deadline:'2036-01-01T00:00:00Z'});
const round=await req('POST','/api/admin/fantasy/rounds',201,body);const url=`/api/fantasy/rounds/${round.id}/team`,adminurl=`/api/admin/fantasy/rounds/${round.id}`;
const starters=[0,2,3,4,7,8,9,10,12,13,14].map(i=>players[i].id),team={name:'My team',squad:players.map(p=>p.id),starters,captainId:players[7].id};
await req('PUT',url,400,{...team,squad:team.squad.slice(1)},'fan');await req('PUT',url,400,{...team,captainId:players[1].id},'fan');await req('PUT',url,200,team,'fan');await req('PUT',url,200,{...team,name:'Saved again'},'fan');assert.equal((await req('GET','/api/fantasy/',200,null,'fan')).entries[0].name,'Saved again');assert.equal((await req('GET','/api/fantasy/',200,null,'other')).entries.length,0);assert.equal((await req('GET','/api/fantasy/',200,null,'fan')).rankings.length,0);checks+=3;
await req('POST',adminurl+'/publish',409,{});await req('PATCH',adminurl+'/deadline',200,{deadline:'2035-01-01T11:00:00Z'});
db.prepare('UPDATE FantasyRound SET deadline=? WHERE id=?').run(new Date(Date.now()-60000).toISOString(),round.id);
await req('PUT',url,409,team,'fan');await req('PATCH',adminurl+'/deadline',409,{deadline:'2035-01-01T12:00:00Z'});await req('POST',adminurl+'/publish',400,{});
for(const f of fixtures)await req('PUT',`/api/fixtures/${f.id}/result`,200,{homeScore:1,awayScore:0});
const stats=(f,p)=>({fixtureId:f.id,playerId:p.id,minutes:90,goals:0,assists:0,saves:0,goalsConceded:p.clubId===f.homeClubId?0:1,yellowCards:0,redCards:0,penaltiesMissed:0,ownGoals:0});
await req('PUT',adminurl+'/stats',403,stats(fixtures[0],players[0]),'fan');await req('POST',adminurl+'/publish',400,{});await req('PUT',adminurl+'/stats',400,{...stats(fixtures[0],players[0]),goalsConceded:3});
for(const f of fixtures)for(const p of players.filter(p=>[f.homeClubId,f.awayClubId].includes(p.clubId)))await req('PUT',adminurl+'/stats',200,stats(f,p));
await req('PUT',adminurl+'/stats',200,{...stats(fixtures[2],players[7]),goals:1,assists:1});await req('POST',adminurl+'/publish',200,{});const result=await req('GET','/api/fantasy/',200,null,'fan');const breakdown=JSON.parse(result.entries[0].breakdown);assert.equal(breakdown.find(p=>p.playerId===players[7].id).points,26);assert.equal(breakdown.find(p=>p.playerId===players[1].id).points,0);assert.equal(result.entries[0].total,breakdown.reduce((a,p)=>a+p.points,0));assert.equal(result.rankings[0].mine,true);checks+=4;
await req('PUT',adminurl+'/stats',409,stats(fixtures[0],players[0]));await req('POST',adminurl+'/publish',409,{});await req('PUT',url,409,team,'fan');

for(const sport of ['Male Basketball','Female Basketball','Volleyball']){
 const cfg=(await req('GET','/api/admin/fantasy',200)).sportConfigs[sport],clubs=[];
 for(let i=0;i<4;i++)clubs.push(await req('POST','/api/clubs',201,{name:sport+i,slug:sport.toLowerCase().replaceAll(' ','-')+i,sport}));
 const pos=sport==='Volleyball'?['S','OH','OH','MB','MB','OPP','L','S','OH','OPP']:['PG','SG','SF','PF','C','PG','SG','SF'];const players=[];
 for(let i=0;i<pos.length;i++)players.push(await req('POST','/api/players',201,{name:sport+' player '+i,sport,position:pos[i],clubId:clubs[i%4].id}));
 const fixtures=[];for(let i=0;i<4;i+=2)fixtures.push(await req('POST','/api/fixtures',201,{sport,homeClubId:clubs[i].id,awayClubId:clubs[i+1].id,startsAt:'2035-01-02T12:00:00Z'}));
 const setup={name:sport+' round',sport,deadline:'2035-01-01T12:00:00Z',budget:100,rules:cfg.rules,fixtureIds:fixtures.map(f=>f.id),catalog:players.map(p=>({id:p.id,position:p.position,price:5}))};
 await req('POST','/api/admin/fantasy/rounds',400,{...setup,rules:admin.defaultRules});
 await req('POST','/api/admin/fantasy/rounds',400,{...setup,catalog:setup.catalog.map(p=>({...p,position:'GK'}))});
 const round=await req('POST','/api/admin/fantasy/rounds',201,setup),url='/api/fantasy/rounds/'+round.id+'/team',adminurl='/api/admin/fantasy/rounds/'+round.id;
 const team={name:sport+' team',squad:players.map(p=>p.id),starters:players.slice(0,cfg.starters).map(p=>p.id),captainId:players[0].id};
 await req('PUT',url,400,{...team,starters:[...team.starters.slice(1),players.at(-1).id]},'fan');
 if(sport==='Volleyball'){await req('PUT',url,400,{...team,starters:players.slice(0,7).map(p=>p.id)},'fan');await req('PUT',url,200,{...team,starters:[...team.starters.slice(0,3),players[6].id,...team.starters.slice(4)]},'fan');}
 await req('PUT',url,200,team,'fan');assert.equal((await req('GET','/api/fantasy/',200,null,'other')).entries.length,0);checks++;
 db.prepare('UPDATE FantasyRound SET deadline=? WHERE id=?').run(new Date(Date.now()-60000).toISOString(),round.id);await req('PUT',url,409,team,'fan');
 for(const f of fixtures)await req('PUT','/api/fixtures/'+f.id+'/result',200,sport==='Volleyball'?{homeScore:3,awayScore:1}:{homeScore:80,awayScore:75});
 const stats=(f,p)=>({fixtureId:f.id,playerId:p.id,...Object.fromEntries(Object.keys(cfg.stats).map(k=>[k,k==='setsPlayed'?4:k==='minutes'?30:0]))});
 await req('PUT',adminurl+'/stats',400,{...stats(fixtures[0],players[0]),goals:1});
 await req('PUT',adminurl+'/stats',400,{...stats(fixtures[0],players[0]),[sport==='Volleyball'?'setsPlayed':'points']:sport==='Volleyball'?5:81});
 await req('POST',adminurl+'/publish',400,{});
 for(const f of fixtures)for(const p of players.filter(p=>[f.homeClubId,f.awayClubId].includes(p.clubId)))await req('PUT',adminurl+'/stats',200,stats(f,p));
 const f=fixtures[0],p=players[0],captainStats=sport==='Volleyball'?{...stats(f,p),kills:4,aces:2,blocks:1,digs:3,receives:5,assists:2,serveErrors:1,attackErrors:1}:{...stats(f,p),points:10,rebounds:4,assists:3,steals:2,blocks:1,turnovers:2,fouls:1};
 await req('PUT',adminurl+'/stats',200,captainStats);await req('POST',adminurl+'/publish',200,{});
 const result=await req('GET','/api/fantasy/',200,null,'fan'),entry=result.entries.find(e=>e.roundId===round.id),breakdown=JSON.parse(entry.breakdown);
 assert.equal(breakdown.find(b=>b.playerId===p.id).points,sport==='Volleyball'?52:54);assert.equal(breakdown.find(b=>b.playerId===players.at(-1).id).points,0);checks+=2;
 await req('PUT',adminurl+'/stats',409,captainStats);await req('POST',adminurl+'/publish',409,{});
}
console.log(`${checks} fantasy checks passed: account privacy, squad validation, deadlines, official statistics, scoring, captain, bench and publication.`);
if(process.argv.includes('--preview')){console.log('Preview: '+base);await new Promise(()=>{});}
}finally{child.kill();db.close();}
