import 'dotenv/config';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import Database from 'better-sqlite3';
import pg from 'pg';
import assert from 'node:assert/strict';
const hash = row => createHash('sha256').update(JSON.stringify(row)).digest('hex');
const quote = name => '"' + name.replaceAll('"','""') + '"';
const local = new Database('prisma/dev.db');
fs.mkdirSync('prisma/backups',{recursive:true}); await local.backup('prisma/backups/before-player-photos-'+Date.now()+'.db');
const tables = local.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> '_prisma_migrations'").all().map(row=>row.name).filter(name=>!['PlayerPhoto'].includes(name));
const beforeLocal=Object.fromEntries(tables.map(t=>[t,local.prepare(`SELECT * FROM ${quote(t)}`).all().map(hash).sort()])); local.close();
const remote=new pg.Client({connectionString:process.env.SUPABASE_DATABASE_URL,connectionTimeoutMillis:15000});
await remote.connect();
try {
  const remoteTables=(await remote.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename NOT IN ('_prisma_migrations','PlayerPhoto')")).rows.map(r=>r.tablename);
  const snapshot=async()=>{const result={};for(const table of remoteTables)result[table]=(await remote.query(`SELECT * FROM ${quote(table)}`)).rows.map(hash).sort();return result;};
  const before=await snapshot();
  for(const args of [['migrate','deploy'],['migrate','deploy','--config','prisma.supabase.config.ts']]) {
    const result=spawnSync(process.execPath,['node_modules/prisma/build/index.js',...args],{stdio:'inherit'}); if(result.status)throw new Error('Photo migration failed');
  }
  assert.deepEqual(await snapshot(),before,'Existing Supabase rows changed');
  const check=new Database('prisma/dev.db'); for(const t of tables)assert.deepEqual(check.prepare(`SELECT * FROM ${quote(t)}`).all().map(hash).sort(),beforeLocal[t],'Existing SQLite rows changed'); check.close();
  console.log('Player photo migration applied. All existing rows in both databases verified unchanged, including accounts, approvals, follows, fantasy and security data.');
} finally {await remote.end();}
