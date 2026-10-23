import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import express from 'express';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { fetchInternationalNews, isNewsSport, safeNewsUrl } from '../dist/server/src/lib/international-news.js';
import { createInternationalNewsRouter } from '../dist/server/src/routes/international-news.js';
for (const sport of ['football','basketball','volleyball']) assert.equal(isNewsSport(sport),true);
for (const value of ['__proto__','rugby',[],null]) assert.equal(isNewsSport(value),false);
for (const url of ['javascript:alert(1)','https://user:pass@example.com','http://example.com']) assert.equal(safeNewsUrl(url),null);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'sports-news-')), filename=path.join(temp,'news.db');
const sqlite=new Database(filename); sqlite.exec(fs.readFileSync('prisma/migrations/20261023130000_news_archive/migration.sql','utf8')); sqlite.close();
const db=new PrismaClient({adapter:new PrismaBetterSqlite3({url:`file:${filename}`})});
const app=express(); app.use('/news',createInternationalNewsRouter(db));
if(process.argv.includes('--preview')) {
  app.use('/api/news/international',createInternationalNewsRouter(db));
  app.get('/api/news',(_req,res)=>res.json([])); app.get('/api/fixtures',(_req,res)=>res.json([]));
  app.use(express.static('aul sports'));
}
const server=app.listen(process.argv.includes('--preview') ? 5138 : 0,'127.0.0.1'); await new Promise(r=>server.once('listening',r));
const base=`http://127.0.0.1:${server.address().port}`;
const realFetch=globalThis.fetch, previousKey=process.env.THENEWSAPI_API_KEY, previousCron=process.env.CRON_SECRET;
delete process.env.THENEWSAPI_API_KEY;
let calls=0;
const mock=async url=>{
  calls++; assert.equal(url.hostname,'api.thenewsapi.com'); assert.equal(url.pathname,'/v1/news/all'); assert.equal(url.searchParams.get('api_token'),'test-secret'); assert.equal(url.searchParams.get('limit'),'3');
  return new Response(JSON.stringify({data:[{title:'Headline',url:'https://publisher.example/story',source:'publisher.example',published_at:new Date().toISOString(),snippet:'Must not save snippets',image_url:'https://example.com/image'}, {title:'Duplicate',url:'https://publisher.example/story',published_at:new Date().toISOString()}, {title:'Unsafe',url:'javascript:alert(1)',published_at:new Date().toISOString()}]}));
};
try {
  for (const sport of ['football','basketball','volleyball']) { const rows=await fetchInternationalNews(sport,'test-secret',mock); assert.equal(rows.length,1); assert.equal('snippet' in rows[0],false); }
  await assert.rejects(fetchInternationalNews('football','key',async()=>new Response('{}',{status:403})),/unavailable/);
  let r=await realFetch(`${base}/news`); assert.equal((await r.json()).status,'not_configured');
  for (const query of ['sport=rugby','sport=football&before=-1','sport=football&before=999999999999']) { r=await realFetch(`${base}/news?${query}`); assert.equal(r.status,400); }
  process.env.THENEWSAPI_API_KEY='test-secret'; globalThis.fetch=mock; calls=0;
  const responses=await Promise.all(Array.from({length:6},()=>realFetch(`${base}/news?sport=football`)));
  for (const response of responses) assert.equal(response.status,200);
  assert.equal(calls,3,'one shared refresh batch across concurrent requests');
  assert.equal(await db.internationalNews.count(),3,'one headline per sport; no duplicates');
  await db.newsRefresh.update({where:{id:'international'},data:{nextAt:new Date(0)}});
  await realFetch(`${base}/news?sport=football`); assert.equal(await db.internationalNews.count(),3,'repeat fetch deduplicates');
  const old=new Date(Date.now()-31*86400000);
  await db.internationalNews.create({data:{sport:'football',linkHash:'expired',title:'Expired',url:'https://publisher.example/expired',source:'Publisher',publishedAt:old}});
  for(let i=0;i<15;i++) await db.internationalNews.create({data:{sport:'football',linkHash:`history-${i}`,title:`Older ${i}`,url:`https://publisher.example/${i}`,source:'Publisher',publishedAt:new Date(Date.now()-(i+1)*3600000)}});
  r=await realFetch(`${base}/news?sport=football`); const first=await r.json(); assert.equal(first.articles.length,12); assert.ok(first.nextCursor); assert.equal(await db.internationalNews.count({where:{linkHash:'expired'}}),0);
  r=await realFetch(`${base}/news?sport=football&before=${first.nextCursor}`); const second=await r.json(); assert.equal(second.articles.length,4); assert.equal(second.nextCursor,null); assert.equal(new Set([...first.articles,...second.articles].map(a=>a.url)).size,16);
  assert.equal('linkHash' in first.articles[0],false); assert.equal('id' in first.articles[0],false);
  globalThis.fetch=async()=>{throw new Error('secret-provider-error');};
  await db.newsRefresh.update({where:{id:'international'},data:{nextAt:new Date(0)}});
  r=await realFetch(`${base}/news?sport=football`); assert.equal(r.status,200); assert.equal((await r.json()).articles.length,12,'outage preserves archive');
  process.env.CRON_SECRET='test-cron-secret'; r=await realFetch(`${base}/news/cleanup`); assert.equal(r.status,401);
  await db.internationalNews.create({data:{sport:'basketball',linkHash:'expired2',title:'Expired',url:'https://publisher.example/expired2',source:'Publisher',publishedAt:old}});
  r=await realFetch(`${base}/news/cleanup`,{headers:{Authorization:'Bearer test-cron-secret'}}); assert.equal(r.status,200); assert.equal(await db.internationalNews.count({where:{linkHash:'expired2'}}),0);
  console.log('News checks passed: provider mapping, three sports, safe links, deduplication, shared refresh claim, 30-day expiry, pagination, outage fallback and authenticated cleanup.');
  if(process.argv.includes('--preview')) { console.log('Synthetic news preview only: '+base+'/news.html'); await new Promise(resolve=>process.once('SIGINT',resolve)); }
} finally {
  globalThis.fetch=realFetch;
  for(const [key,value] of [['THENEWSAPI_API_KEY',previousKey],['CRON_SECRET',previousCron]]) if(value===undefined)delete process.env[key];else process.env[key]=value;
  await new Promise(r=>server.close(r)); await db.$disconnect(); fs.rmSync(temp,{recursive:true,force:true});
}
