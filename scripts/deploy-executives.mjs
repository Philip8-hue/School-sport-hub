import 'dotenv/config';import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';import Database from 'better-sqlite3';import pg from 'pg';import assert from 'node:assert/strict';
const quote=name=>'"'+name.replaceAll('"','""')+'"',hash=row=>createHash('sha256').update(JSON.stringify(row)).digest('hex');
const local=new Database('prisma/dev.db');fs.mkdirSync('prisma/backups',{recursive:true});await local.backup('prisma/backups/before-executives-'+Date.now()+'.db');
const tables=local.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> '_prisma_migrations'").all().map(r=>r.name);
const columns=Object.fromEntries(tables.map(t=>[t,local.prepare(`PRAGMA table_info(${quote(t)})`).all().map(c=>quote(c.name)).join(',')]));
const snapshotLocal=db=>Object.fromEntries(tables.map(t=>[t,db.prepare(`SELECT ${columns[t]} FROM ${quote(t)}`).all().map(hash).sort()]));
const beforeLocal=snapshotLocal(local);local.close();
const remote=new pg.Client({connectionString:process.env.SUPABASE_DATABASE_URL,connectionTimeoutMillis:15000});await remote.connect();
try{
 const remoteTables=(await remote.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations'")).rows.map(r=>r.tablename),remoteColumns={};
 for(const t of remoteTables)remoteColumns[t]=(await remote.query(`SELECT * FROM ${quote(t)} LIMIT 0`)).fields.map(f=>quote(f.name)).join(',');
 const snapshot=async()=>{const result={};for(const t of remoteTables)result[t]=(await remote.query(`SELECT ${remoteColumns[t]} FROM ${quote(t)}`)).rows.map(hash).sort();return result;};
 const before=await snapshot();
 for(const args of [['migrate','deploy'],['migrate','deploy','--config','prisma.supabase.config.ts']]){const result=spawnSync(process.execPath,['node_modules/prisma/build/index.js',...args],{stdio:'inherit'});if(result.status)throw Error('Executive migration failed');}
 const after=await snapshot();for(const table of remoteTables){const missing=before[table].filter(value=>!after[table].includes(value));if(missing.length)throw Error('Pre-existing rows changed during verification in '+table+' ('+missing.length+' rows). Live activity may require a fresh check.');}const check=new Database('prisma/dev.db');const afterLocal=snapshotLocal(check);for(const table of tables)if(beforeLocal[table].some(value=>!afterLocal[table].includes(value)))throw Error('Pre-existing SQLite rows changed in '+table);check.close();
 const admins=await remote.query(`SELECT COUNT(*)::int AS count FROM "User" WHERE "role"='ADMIN'`);
 console.log('Executive access and news category migrations applied. All existing values verified unchanged in both databases. Overall admin accounts retained: '+admins.rows[0].count);
}finally{await remote.end();}
