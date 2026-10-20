import 'dotenv/config';
import Database from 'better-sqlite3';
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Prisma's timestamp columns contain UTC without a timezone suffix.
pg.types.setTypeParser(1114, value => new Date(value.replace(' ', 'T') + 'Z'));

const tables = ['User', 'Item', 'Club', 'Player', 'Fixture', 'Result', 'LeagueTable', 'NewsArticle', 'HomepageContent'];
const booleanFields = new Set(['isActive', 'captain', 'published']);
const dateFields = new Set(['createdAt', 'updatedAt', 'startsAt', 'playedAt', 'publishedAt']);
const quote = name => '"' + name.replaceAll('"', '""') + '"';
const normalize = row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key,
  value == null ? null : booleanFields.has(key) ? Boolean(value)
    : dateFields.has(key) ? new Date(typeof value === 'bigint' ? Number(value) : value).toISOString() : value]));
const fingerprint = rows => createHash('sha256').update(JSON.stringify(rows.map(normalize).map(row =>
  Object.fromEntries(Object.keys(row).sort().map(key => [key, row[key]]))))).digest('hex');

let sqlite;
let client;
let inTransaction = false;
try {
  if (!process.env.SUPABASE_DATABASE_URL) throw new Error('Save SUPABASE_DATABASE_URL in the project .env first.');
  const url = new URL(process.env.SUPABASE_DATABASE_URL);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('SUPABASE_DATABASE_URL must be a PostgreSQL connection string.');
  const source = process.env.SQLITE_SOURCE_URL ?? (process.env.DATABASE_URL?.startsWith('file:') ? process.env.DATABASE_URL : 'file:./prisma/dev.db');
  if (!source.startsWith('file:')) throw new Error('SQLITE_SOURCE_URL must start with file:.');
  const sourcePath = path.resolve(source.slice(5));
  sqlite = new Database(sourcePath, { readonly: true, fileMustExist: true });
  const backupDir = path.resolve('prisma/backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `before-supabase-${Date.now()}.db`);
  await sqlite.backup(backupPath);
  sqlite.close();
  sqlite = new Database(backupPath, { readonly: true, fileMustExist: true });
  console.log('Consistent SQLite backup saved: ' + backupPath);
  if (sqlite.pragma('integrity_check', { simple: true }) !== 'ok') throw new Error('SQLite integrity check failed.');
  if (sqlite.pragma('foreign_key_check').length) throw new Error('SQLite contains invalid foreign keys; no data was copied.');
  const records = Object.fromEntries(tables.map(table => [table, sqlite.prepare(`SELECT * FROM ${quote(table)} ORDER BY id`).all()]));
  client = new pg.Client({ connectionString: process.env.SUPABASE_DATABASE_URL, connectionTimeoutMillis: 15000 });
  await client.connect();
  await client.query('BEGIN');
  inTransaction = true;
  await client.query("SET LOCAL lock_timeout = '10s'");
  await client.query('LOCK TABLE ' + tables.map(table => 'public.' + quote(table)).join(', ') + ' IN EXCLUSIVE MODE');
  if (!process.argv.includes('--verify-only')) {
    for (const table of tables) {
      const { rows } = await client.query(`SELECT count(*)::int AS count FROM public.${quote(table)}`);
      if (rows[0].count) throw new Error(`Destination ${table} already has data. Import stopped without overwriting anything. Use --verify-only to compare a previous import.`);
    }
    for (const table of tables) {
      for (const original of records[table]) {
        const row = normalize(original);
        const keys = Object.keys(row);
        await client.query(`INSERT INTO public.${quote(table)} (${keys.map(quote).join(', ')}) VALUES (${keys.map((_, index) => '$' + (index + 1)).join(', ')})`, Object.values(row));
      }
    }
  }
  for (const table of tables) {
    const { rows } = await client.query(`SELECT * FROM public.${quote(table)} ORDER BY id`);
    if (fingerprint(rows) !== fingerprint(records[table])) throw new Error(`Verification failed for ${table}; all import changes will be rolled back.`);
    console.log(`Verified ${table}: ${rows.length} records, all fields match.`);
  }
  if (!process.argv.includes('--verify-only')) {
    for (const table of tables.filter(table => table !== 'HomepageContent')) {
      await client.query(`SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM public.${quote(table)}), 1), EXISTS(SELECT 1 FROM public.${quote(table)}))`, [`public.${quote(table)}`]);
    }
  }
  await client.query('COMMIT');
  inTransaction = false;
  console.log('Supabase data verified. Original SQLite database was not changed.');
} catch (error) {
  if (inTransaction) await client.query('ROLLBACK').catch(() => {});
  // Never print connection strings, query parameters, or user records.
  let message = String(error.message ?? error);
  for (const secret of [process.env.SUPABASE_DATABASE_URL]) {
    if (!secret) continue;
    message = message.replaceAll(secret, '[connection redacted]');
    try { const password = new URL(secret).password; if (password) message = message.replaceAll(password, '[redacted]').replaceAll(decodeURIComponent(password), '[redacted]'); } catch {}
  }
  console.error('Migration stopped: ' + message);
  process.exitCode = 1;
} finally {
  sqlite?.close();
  await client?.end().catch(() => {});
}
