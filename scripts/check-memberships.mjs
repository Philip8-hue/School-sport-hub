import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'sports-memberships-'));
const file=path.join(temp,'check.db');
const db=new Database(file);
for(const dir of fs.readdirSync('prisma/migrations').filter(x=>fs.existsSync(`prisma/migrations/${x}/migration.sql`)).sort())db.exec(fs.readFileSync(`prisma/migrations/${dir}/migration.sql`,'utf8'));
db.prepare('INSERT INTO User(email,name,passwordHash,role,isActive,updatedAt) VALUES (?,?,?,?,?,?)').run('admin@example.test','Test Admin',await bcrypt.hash('Admin-test-password',4),'ADMIN',1,new Date().toISOString());
db.close();
const port=5131,host=process.argv.includes('--preview')?'127.0.0.2':'127.0.0.1',base=`http://${host}:${port}`;
const child=spawn(process.execPath,['dist/server/src/index.js'],{env:{...process.env,NODE_ENV:'test',REQUIRE_EMAIL_VERIFICATION:'false',AUTH_TEST_EMAIL_DIR:path.join(temp,'mail'),VERCEL:'0',DATABASE_PROVIDER:'sqlite',DATABASE_URL:'file:'+file,HOST:host,PORT:String(port),JWT_SECRET:'membership-test-secret-at-least-32-characters',ALLOW_PUBLIC_REGISTRATION:'true'},stdio:['ignore','pipe','pipe']});
const sessions={};let checks=0;
async function req(method,url,status,body,who){
 const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',Origin:base,...(sessions[who]?{Cookie:sessions[who]}:{})},body:body?JSON.stringify(body):undefined});
 const data=await r.json().catch(()=>({}));
assert.equal(r.status,status,`${method} ${url}: ${JSON.stringify(data)}`);checks++;
 if(who&&r.headers.get('set-cookie'))sessions[who]=r.headers.get('set-cookie').split(';')[0];return data;
}
const dashboard=who=>req('GET','/api/member/dashboard',200,null,who);
const photoInput = await sharp({create:{width:700,height:500,channels:3,background:'#346747'}}).jpeg().toBuffer();
async function upload(id,who,status,bytes=photoInput){
 const response=await fetch(base+'/api/player-photos/'+id,{method:'PUT',headers:{Origin:base,'Content-Type':'application/octet-stream',...(sessions[who]?{Cookie:sessions[who]}:{})},body:bytes});
 assert.equal(response.status,status);checks++;return response;
}
const approve=(id,status='APPROVED')=>req('PATCH','/api/admin/approvals/requests/'+id,200,{status,reviewNote:'Verified through university team records.'},'admin');
let log='';child.stderr.on('data',chunk=>{log+=chunk;});
try{
 await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(new Error('Server exited '+code+': '+log)));setTimeout(()=>reject(new Error('Startup timed out: '+log)),45000).unref();});
 await req('GET','/api/member/dashboard',401);await req('GET','/api/admin/approvals/queue',401);
 await req('POST','/api/auth/login',200,{email:'admin@example.test',password:'Admin-test-password'},'admin');
 for(const [who,type]of [['alice','PLAYER'],['bob','PLAYER'],['sam','COACH'],['fan','FAN']]){
  const result=await req('POST','/api/auth/register',201,{email:who+'@example.test',password:'Regular-test-password',name:who,accountType:type,role:'ADMIN'},who);assert.equal(result.user.role,'USER');
 }
 for(const route of ['/admin.html','/admin-preview.html','/%61dmin.html','/ADMIN.HTML','/admin']){
  const guest=await fetch(base+route,{redirect:'manual'});assert.equal(guest.status,303);assert.equal(guest.headers.get('location'),'/admin-login.html');checks++;
  const regular=await fetch(base+route,{redirect:'manual',headers:{Cookie:sessions.fan}});assert.equal(regular.status,303);assert.match(regular.headers.get('location'),/^\/account.html/);checks++;
  const admin=await fetch(base+route,{redirect:'manual',headers:{Cookie:sessions.admin}});assert.equal(admin.status,200);assert.match(await admin.text(),/Admin/);checks++;
 }
 await req('POST','/api/auth/admin-login',403,{email:'fan@example.test',password:'Regular-test-password'},'admin');
 assert.equal((await req('GET','/api/auth/me',200,null,'admin')).user.role,'ADMIN');
 await req('POST','/api/auth/admin-login',200,{email:'admin@example.test',password:'Admin-test-password'},'admin');
 const clubs=[];for(const name of ['Home','Away','Outside','Elsewhere'])clubs.push(await req('POST','/api/clubs',201,{name,slug:name.toLowerCase(),sport:'Male Football'},'admin'));
 const [home,away,outside,elsewhere]=clubs;
 const player=await req('POST','/api/players',201,{name:'Linked Player',sport:'Male Football',clubId:home.id,position:'MID'},'admin');
 const other=await req('POST','/api/players',201,{name:'Other Player',sport:'Male Football',clubId:away.id},'admin');
 const fixture=await req('POST','/api/fixtures',201,{sport:'Male Football',homeClubId:home.id,awayClubId:away.id,startsAt:'2030-01-01T15:00:00Z'},'admin');
 const foreign=await req('POST','/api/fixtures',201,{sport:'Male Football',homeClubId:outside.id,awayClubId:elsewhere.id,startsAt:'2030-01-01T15:00:00Z'},'admin');
 await req('POST','/api/news',201,{title:'Visible story',slug:'visible',content:'Published',published:true},'admin');
 await req('POST','/api/news',201,{title:'Private draft',slug:'private',content:'Not published',published:false},'admin');
 const claim=await req('POST','/api/member/requests',201,{kind:'PLAYER',targetId:player.id,message:'I play for this team and need my profile linked.'},'alice');
 const competing=await req('POST','/api/member/requests',201,{kind:'PLAYER',targetId:player.id,message:'Please verify which account owns this player.'},'bob');
 const coaching=await req('POST','/api/member/requests',201,{kind:'COACH',targetId:home.id,message:'I coach this team; please verify my assignment.'},'sam');
 await req('POST','/api/member/requests',409,{kind:'PLAYER',targetId:player.id,message:'Duplicate pending profile request.'},'alice');
 assert.equal((await dashboard('alice')).playerLinks.length,0);assert.equal((await dashboard('sam')).coachLinks.length,0);
 await req('PATCH',`/api/member/players/${player.id}/bio`,403,{bio:'Unapproved'},'alice');
 await upload(player.id,'alice',403);await upload(player.id,null,401);
 await req('POST','/api/member/announcements',403,{clubId:home.id,title:'Not approved',body:'No access'},'sam');
 await req('PATCH',`/api/admin/approvals/requests/${claim.id}`,403,{status:'APPROVED'},'alice');
 await approve(claim.id);await approve(coaching.id);
 await req('PATCH',`/api/admin/approvals/requests/${competing.id}`,409,{status:'APPROVED'},'admin');
 await req('PATCH',`/api/admin/approvals/requests/${claim.id}`,409,{status:'APPROVED'},'admin');
 assert.equal((await dashboard('alice')).playerLinks[0].player.id,player.id);assert.equal((await dashboard('sam')).coachLinks[0].clubId,home.id);
 await req('PUT','/api/member/view',200,{accountType:'COACH'},'fan');
 await req('POST','/api/member/announcements',403,{clubId:home.id,title:'Forged coach',body:'Still a fan'},'fan');
 await req('GET','/api/admin/approvals/queue',403,null,'sam');
 await req('PATCH',`/api/players/${player.id}`,403,{goals:99},'alice');await req('PATCH',`/api/players/${player.id}`,403,{goals:99},'sam');
 await req('PATCH',`/api/member/players/${player.id}/bio`,200,{bio:'My approved profile bio'},'alice');
 await upload(player.id,'bob',403);await upload(player.id,'sam',403);await upload(other.id,'alice',403);
 await upload(player.id,'alice',400,Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'));
 await upload(player.id,'alice',400,Buffer.from('not an image'));
 await upload(player.id,'alice',413,Buffer.alloc(3*1024*1024+1));
 const uploaded=await (await upload(player.id,'alice',200)).json();assert.match(uploaded.photoUrl,new RegExp('^/api/player-photos/'+player.id));
 const publicPhoto=await fetch(base+uploaded.photoUrl);assert.equal(publicPhoto.status,200);assert.match(publicPhoto.headers.get('content-type'),/image\/webp/);
 const imageBytes=Buffer.from(await publicPhoto.arrayBuffer());assert.ok(imageBytes.length<=48*1024);const metadata=await sharp(imageBytes).metadata();assert.equal(metadata.width,700);assert.equal(metadata.height,500);assert.equal(metadata.exif,undefined);
 assert.equal((await dashboard('alice')).playerLinks[0].player.photoUrl,uploaded.photoUrl);
 await upload(player.id,'alice',200);const photoDb=new Database(file);assert.equal(photoDb.prepare('SELECT COUNT(*) AS count FROM PlayerPhoto WHERE playerId=?').get(player.id).count,1);photoDb.close();
 await req('DELETE',`/api/player-photos/${player.id}`,403,null,'bob');await req('DELETE',`/api/player-photos/${player.id}`,200,null,'alice');assert.equal((await fetch(base+'/api/player-photos/'+player.id)).status,404);
 await upload(player.id,'alice',200);
 await req('PATCH',`/api/member/players/${other.id}/bio`,403,{bio:'Not mine'},'alice');
 await req('PATCH',`/api/member/players/${player.id}/bio`,400,{bio:'Wrong',role:'ADMIN'},'alice');
 await req('PUT','/api/member/availability',200,{playerId:player.id,fixtureId:fixture.id,status:'AVAILABLE',note:'Ready for the match'},'alice');
 await req('PUT','/api/member/availability',403,{playerId:player.id,fixtureId:fixture.id,status:'UNAVAILABLE'},'bob');
 await req('PUT','/api/member/availability',400,{playerId:player.id,fixtureId:foreign.id,status:'AVAILABLE'},'alice');
 await req('POST','/api/member/announcements',201,{clubId:home.id,title:'Private training',body:'Team-only training details'},'sam');
 await req('POST','/api/member/announcements',403,{clubId:away.id,title:'Wrong team',body:'No access'},'sam');
 await req('PUT','/api/member/lineups',400,{clubId:home.id,fixtureId:fixture.id,playerIds:[other.id]},'sam');
 await req('PUT','/api/member/lineups',400,{clubId:home.id,fixtureId:foreign.id,playerIds:[player.id]},'sam');
 await req('PUT','/api/member/lineups',200,{clubId:home.id,fixtureId:fixture.id,playerIds:[player.id],note:'Proposed starting midfielder'},'sam');
 let mine=await dashboard('alice');assert.equal(mine.announcements.length,1);assert.equal(mine.lineups.length,1);assert.equal(mine.availability.length,1);
 const team=await dashboard('sam');assert.equal(team.availability.length,1);assert.equal(team.availability[0].note,'Ready for the match');
 await req('PUT','/api/member/favorites',200,{kind:'CLUB',targetId:home.id,following:true},'fan');
 await req('PUT','/api/member/favorites',200,{kind:'CLUB',targetId:home.id,following:true},'fan');
 await req('PUT','/api/member/favorites',200,{kind:'PLAYER',targetId:player.id,following:true},'fan');

 const publicClub=await req('GET','/api/followers/CLUB/'+home.id,200);assert.equal(publicClub.count,1);assert.deepEqual(publicClub.followers,[{displayName:'fan'}]);checks+=2;
 const publicPlayer=await req('GET','/api/followers/PLAYER/'+player.id,200);assert.equal(publicPlayer.count,1);assert.ok(!JSON.stringify(publicPlayer).includes('email'));assert.ok(!JSON.stringify(publicPlayer).includes('userId'));assert.ok(!JSON.stringify(publicPlayer).includes('password'));checks+=4;
 await req('GET','/api/followers/PLAYER/99999999',404);await req('GET','/api/followers/USER/1',400);await req('GET','/api/followers/CLUB/'+home.id+'?cursor=invalid',400);
 const followerDb=new Database(file);for(let i=0;i<23;i++){const record=followerDb.prepare('INSERT INTO User(email,name,isActive,updatedAt) VALUES(?,?,?,?)').run('pagination-'+i+'@example.test',i===22?'private@example.test':'Public fan '+i,i===21?0:1,new Date().toISOString());followerDb.prepare('INSERT INTO Favorite(userId,kind,targetId) VALUES(?,?,?)').run(Number(record.lastInsertRowid),'CLUB',home.id);}followerDb.close();
 const firstPage=await req('GET','/api/followers/CLUB/'+home.id,200);assert.equal(firstPage.count,23);assert.equal(firstPage.followers.length,20);assert.ok(firstPage.nextCursor);assert.equal(firstPage.followers[0].displayName,'Sports Hub member');assert.ok(!JSON.stringify(firstPage).includes('private@example.test'));checks+=5;
 const nextPage=await req('GET','/api/followers/CLUB/'+home.id+'?cursor='+firstPage.nextCursor,200);assert.equal(nextPage.followers.length,3);assert.equal(nextPage.nextCursor,null);checks+=2;
 const feed=await dashboard('fan');assert.equal(feed.favorites.length,2);assert.equal(feed.announcements.length,0);assert.equal(feed.lineups.length,0);assert.equal(feed.availability.length,0);assert.equal(feed.fixtures.length,1);assert.equal(feed.news.length,1);assert.equal(feed.news[0].slug,'visible');
 const following=await req('GET','/api/member/following',200,null,'fan');assert.equal(following.clubs.length,1);assert.equal(following.players.length,1);assert.equal(following.favorites.length,2);assert.ok(!('announcements' in following));
 assert.equal((await req('GET','/api/member/following',200,null,'alice')).favorites.length,0);
 await req('GET','/api/member/following',401);
 const correction=await req('POST','/api/member/submissions',201,{kind:'PROFILE_CORRECTION',playerId:player.id,details:'Please verify the goals recorded for me.'},'alice');
 await req('POST','/api/member/submissions',403,{kind:'PROFILE_CORRECTION',playerId:other.id,details:'Not my profile'},'alice');
 await req('POST','/api/member/submissions',400,{kind:'MATCH_STATS',clubId:home.id,details:'No fixture selected'},'sam');
 await req('POST','/api/member/submissions',400,{kind:'MATCH_STATS',clubId:home.id,fixtureId:foreign.id,details:'Wrong fixture'},'sam');
 await req('POST','/api/member/submissions',201,{kind:'MATCH_STATS',clubId:home.id,fixtureId:fixture.id,details:'Proposed match statistics for review.'},'sam');
 await req('POST','/api/member/submissions',403,{kind:'ROSTER_CHANGE',clubId:home.id,details:'Fan cannot edit roster'},'fan');
 const queue=await req('GET','/api/admin/approvals/queue',200,null,'admin');assert.equal(queue.submissions.length,2);assert.equal(queue.requests.length,3);
 await req('PATCH',`/api/admin/approvals/submissions/${correction.id}`,200,{status:'REJECTED',reviewNote:'Checked the match records; no correction required.'},'admin');
 assert.equal((await dashboard('alice')).submissions[0].status,'REJECTED');
 await req('PATCH',`/api/players/${player.id}`,200,{goals:3},'admin');
 mine=await dashboard('alice');assert.equal(mine.playerLinks[0].player.goals,3);assert.equal(mine.playerLinks[0].player.snapshots.length,2);
 const publicPlayers=await req('GET','/api/players',200);assert.ok(publicPlayers.every(p=>!('ownership'in p)&&!('availability'in p)&&!('snapshots'in p)));
 const secondRole=await req('POST','/api/member/requests',201,{kind:'COACH',targetId:away.id,message:'I also coach the away team; please verify.'},'alice');await approve(secondRole.id);
 mine=await dashboard('alice');assert.equal(mine.playerLinks.length,1);assert.equal(mine.coachLinks.length,1);assert.equal(mine.user.role,'USER');
 await approve(claim.id,'REVOKED');mine=await dashboard('alice');assert.equal(mine.playerLinks.length,0);assert.equal(mine.announcements.length,0);
 await req('PATCH',`/api/member/players/${player.id}/bio`,403,{bio:'Revoked owner'},'alice');
 await upload(player.id,'alice',403);await req('DELETE',`/api/player-photos/${player.id}`,403,null,'alice');
 await approve(coaching.id,'REVOKED');const revoked=await dashboard('sam');assert.equal(revoked.coachLinks.length,0);assert.equal(revoked.announcements.length,0);assert.equal(revoked.availability.length,0);
 await req('POST','/api/member/announcements',403,{clubId:home.id,title:'Revoked',body:'No longer allowed'},'sam');
 await req('PUT','/api/member/lineups',403,{clubId:home.id,fixtureId:fixture.id,playerIds:[player.id]},'sam');
 await approve(competing.id);assert.equal((await dashboard('bob')).playerLinks.length,1);
 await req('PUT','/api/member/favorites',200,{kind:'CLUB',targetId:home.id,following:false},'fan');assert.equal((await dashboard('fan')).favorites.length,1);assert.equal((await req('GET','/api/followers/CLUB/'+home.id,200)).count,22);checks++;
 console.log(`Passed ${checks} membership HTTP checks, including approval, duplicate claims, multi-role access, privacy, history, submissions, favourites and revocation.`);
 if(process.argv.includes('--preview')){
  const request=await req('POST','/api/member/requests',201,{kind:'COACH',targetId:home.id,message:'Please verify my coaching assignment for the preview.'},'sam');await approve(request.id);
  await req('PUT','/api/member/view',200,{accountType:'FAN'},'fan');
  await req('POST','/api/member/requests',201,{kind:'COACH',targetId:outside.id,message:'Please verify my additional coaching team.'},'alice');
  await req('POST','/api/member/submissions',201,{kind:'PROFILE_CORRECTION',playerId:player.id,details:'Please verify my jersey number against the team roster.'},'bob');
  console.log('Isolated membership preview at '+base+' (alice/bob/sam/fan@example.test, Regular-test-password)');await new Promise(resolve=>{process.once('SIGTERM',resolve);process.once('SIGINT',resolve);});
 }
}finally{child.kill();await new Promise(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',resolve);});fs.rmSync(temp,{recursive:true,force:true});}
