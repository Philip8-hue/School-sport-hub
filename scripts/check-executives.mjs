import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawn} from 'node:child_process';
import Database from 'better-sqlite3';import bcrypt from 'bcryptjs';import {TOTP,Secret} from 'otpauth';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'sports-executives-')),file=path.join(temp,'test.db'),db=new Database(file);
for(const migration of fs.readdirSync('prisma/migrations').sort())if(fs.existsSync(`prisma/migrations/${migration}/migration.sql`))db.exec(fs.readFileSync(`prisma/migrations/${migration}/migration.sql`,'utf8'));
const password='Executive-test-password',hash=await bcrypt.hash(password,4);
for(const [index,name] of ['admin','admin2','football','basketball','volleyball','fan'].entries())db.prepare('INSERT INTO User(id,email,name,passwordHash,role,updatedAt) VALUES(?,?,?,?,?,?)').run(index+1,name+'@example.test',name,hash,index<2?'ADMIN':'USER',new Date().toISOString());
const beforeAdmins=db.prepare("SELECT * FROM User WHERE role='ADMIN' ORDER BY id").all();
const port=5152,host=process.argv.includes('--preview')?'127.0.0.2':'127.0.0.1',base=`http://${host}:${port}`;
const noAuthenticator=process.argv.includes('--no-authenticator');
const child=spawn(process.execPath,['dist/server/src/index.js'],{env:{...process.env,VERCEL:'0',NODE_ENV:'test',DATABASE_PROVIDER:'sqlite',DATABASE_URL:'file:'+file,HOST:host,PORT:String(port),JWT_SECRET:'executive-test-jwt-secret-at-least-32-characters',AUTH_ENCRYPTION_KEY:noAuthenticator?'':'cd'.repeat(32),ALLOW_PUBLIC_REGISTRATION:'true',REQUIRE_EMAIL_VERIFICATION:'false'},stdio:['ignore','pipe','pipe']});
let log='',checks=0;child.stderr.on('data',chunk=>log+=chunk);const cookies={};
async function req(method,url,status,body,who='admin'){
 const response=await fetch(base+url,{method,redirect:'manual',headers:{Origin:base,'Content-Type':'application/json',...(cookies[who]?{Cookie:cookies[who]}:{})},body:body?JSON.stringify(body):undefined});
 const data=await response.json().catch(()=>({}));assert.equal(response.status,status,`${method} ${url}: ${JSON.stringify(data)}`);checks++;if(response.headers.get('set-cookie')&&who)cookies[who]=response.headers.get('set-cookie').split(';')[0];return data;
}
const sign=(who,sport=who,status=200)=>req('POST','/api/executive/login',status,{email:who+'@example.test',password,sport},who);
try {
 await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('exit',code=>reject(Error('Server exited '+code+' '+log)));setTimeout(()=>reject(Error('Startup timeout '+log)),45000).unref();});
 await req('GET','/api/executive/dashboard',401,null,'guest');
 await req('POST','/api/auth/admin-login',200,{email:'admin@example.test',password});
 await req('POST','/api/auth/admin-login',200,{email:'admin2@example.test',password},'admin2');
 await req('PATCH','/api/admin/users/1',400,{role:'EXECUTIVE',executiveSport:'football'});
 await req('PATCH','/api/admin/users/2',400,{role:'EXECUTIVE',executiveSport:'football'});
 await req('PATCH','/api/admin/users/3',400,{role:'EXECUTIVE'});
 const registered=await req('POST','/api/auth/register',201,{name:'Forged executive',email:'forged@example.test',password,role:'EXECUTIVE',executiveSport:'football'},'forged');assert.equal(registered.user.role,'USER');
 await req('PATCH','/api/admin/users/3',403,{role:'EXECUTIVE',executiveSport:'football'},'forged');
 await sign('football','football',403);
 const scopes={football:['Male Football','Female Football'],basketball:['Male Basketball','Female Basketball'],volleyball:['Volleyball']};
 const objects={};
 for(const [index,sport] of ['football','basketball','volleyball'].entries()){
  await req('PATCH','/api/admin/users/'+(index+3),200,{role:'EXECUTIVE',executiveSport:sport});
  db.prepare('UPDATE User SET mfaRequiredAfter=? WHERE id=?').run(new Date(Date.now()-60000).toISOString(),index+3);
  await sign(sport,sport==='football'?'basketball':'football',403);
  assert.equal((await sign(sport)).mfaSetupRequired,false);
  assert.equal((await req('GET','/api/auth/security',200,null,sport)).authenticatorConfigured,!noAuthenticator);
  assert.equal((await req('POST','/api/auth/login',200,{email:sport+'@example.test',password},sport)).mfaSetupRequired,false);
  await req('GET','/executive.html',200,null,sport);await req('GET','/admin.html',303,null,sport);
  await req('POST','/api/auth/admin-login',403,{email:sport+'@example.test',password},sport);
  for(const url of ['/api/admin/users','/api/admin/summary','/api/admin/approvals/queue','/api/auth/security-events','/api/news?all=true'])await req('GET',url,403,null,sport);
  await req('PATCH','/api/admin/users/6',403,{role:'ADMIN'},sport);
  await req('PATCH','/api/admin/approvals/requests/1',403,{status:'APPROVED'},sport);
  const category=scopes[sport][0];
  const home=await req('POST','/api/executive/clubs',201,{name:sport+' Home',slug:sport+'-home',sport:category},sport);
  const away=await req('POST','/api/executive/clubs',201,{name:sport+' Away',slug:sport+'-away',sport:category},sport);
  const player=await req('POST','/api/executive/players',201,{name:sport+' Player',sport:category,clubId:home.id},sport);
  const fixture=await req('POST','/api/executive/fixtures',201,{sport:category,startsAt:new Date(Date.now()+4*86400000).toISOString(),homeClubId:home.id,awayClubId:away.id},sport);
  await req('PATCH','/api/executive/clubs/'+home.id,200,{name:sport+' Team'},sport);
  await req('PATCH','/api/executive/players/'+player.id,200,{rating:7},sport);
  await req('PATCH','/api/executive/fixtures/'+fixture.id,200,{venue:'University court'},sport);
  await req('PATCH','/api/players/'+player.id,403,{rating:9},sport);
  await req('PUT','/api/executive/tables',200,{sport:category,clubId:home.id,played:1,won:1,drawn:0,lost:0,points:3},sport);
  const news=await req('POST','/api/executive/news',201,{sport:category,title:sport+' news',slug:sport+'-news',content:'School team update.',published:true},sport);
  await req('PATCH','/api/executive/news/'+news.id,200,{content:'Updated school story.'},sport);
  await req('DELETE','/api/executive/players/'+player.id,404,null,sport);
  await req('GET','/api/executive/fantasy',404,null,sport);
  const dashboard=await req('GET','/api/executive/dashboard',200,null,sport);
  for(const key of ['clubs','players','fixtures','tables','news'])assert.ok(dashboard[key].every(row=>scopes[sport].includes(row.sport)));
  objects[sport]={home,away,player,fixture,news};
  if(scopes[sport].length>1)await req('POST','/api/executive/clubs',201,{name:sport+' Women',slug:sport+'-women',sport:scopes[sport][1]},sport);
 }
 for (const url of ['/api/fantasy','/api/admin/fantasy','/aupl%20fantasy.html','/aupl%20fantasy-football.html','/aupl%20fantasy-basketball.html','/aupl%20fantasy-volleyball.html']) await req('GET',url,404);
 const general=await req('POST','/api/news',201,{title:'General school news',slug:'general-school',content:'Overall admins only',published:true});
 for(const sport of Object.keys(scopes)){
  const own=objects[sport],other=objects[sport==='football'?'basketball':'football'];
  for(const resource of ['clubs','players','fixtures','news']){
   const target=resource==='clubs'?other.home:resource==='players'?other.player:resource==='fixtures'?other.fixture:other.news;
   await req('PATCH','/api/executive/'+resource+'/'+target.id,403,resource==='news'?{title:'Forbidden'}:resource==='fixtures'?{venue:'Forbidden'}:{name:'Forbidden'},sport);
  }
  await req('PATCH','/api/executive/news/'+general.id,403,{title:'Forbidden general news'},sport);
  await req('POST','/api/executive/clubs',403,{name:'Forbidden',slug:'forbidden',sport:other.home.sport},sport);
  await req('PATCH','/api/executive/players/'+own.player.id,403,{sport:other.home.sport},sport);
  await req('PATCH','/api/executive/players/'+own.player.id,403,{clubId:other.home.id},sport);
  await req('PATCH','/api/executive/fixtures/'+own.fixture.id,403,{homeClubId:other.home.id},sport);
  await req('PUT','/api/executive/fixtures/'+other.fixture.id+'/result',403,{homeScore:1,awayScore:0},sport);
  await req('PUT','/api/executive/tables',403,{sport:own.home.sport,clubId:other.home.id,played:0,won:0,drawn:0,lost:0,points:0},sport);
  await req('PUT','/api/executive/fixtures/'+own.fixture.id+'/result',200,{homeScore:0,awayScore:0},sport);
 }
 // Real admin permission is untouched; executive sessions are revoked on scope changes.
 await req('PATCH','/api/players/'+objects.basketball.player.id,200,{rating:9},'admin2');
 await req('PATCH','/api/admin/users/3',200,{role:'EXECUTIVE',executiveSport:'basketball'});
 await req('GET','/api/executive/dashboard',401,null,'football');await sign('football','football',403);await sign('football','basketball');
 await req('PATCH','/api/admin/users/3',200,{role:'USER'});await req('GET','/api/executive/dashboard',401,null,'football');
 if(!noAuthenticator){
 const setup=await req('POST','/api/auth/mfa/setup',200,{password},'volleyball');
 const code=new TOTP({secret:Secret.fromBase32(setup.secret),algorithm:'SHA1',digits:6,period:30}).generate();
 const confirmed=await req('POST','/api/auth/mfa/confirm',200,{setupToken:setup.setupToken,code},'volleyball');
 await req('GET','/api/executive/dashboard',200,null,'volleyball');
 await req('POST','/api/auth/logout',204,null,'volleyball');const challenge=await sign('volleyball');assert.equal(challenge.mfaRequired,true);
 await req('POST','/api/auth/mfa/login',200,{challenge:challenge.challenge,code:confirmed.recoveryCodes[0]},'volleyball');
 }
 await req('GET','/api/admin/approvals/queue',403,null,'volleyball');
 assert.deepEqual(db.prepare("SELECT * FROM User WHERE role='ADMIN' ORDER BY id").all(),beforeAdmins,'Both overall admin records must remain unchanged');
 console.log(`Passed ${checks} executive checks: all three sport scopes, players/clubs/fixtures/results/tables/news, forged grants, ID tampering, approval denial, revocation, ${noAuthenticator?'access without authenticator configuration':'opt-in two-step login'} and both overall admins unchanged.`);
 if(process.argv.includes('--preview')) {console.log('Isolated executive preview: '+base+' (basketball@example.test / Executive-test-password)');await new Promise(resolve=>process.once('SIGINT',resolve));}
} finally {child.kill();await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));db.close();}
