import 'dotenv/config';
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.SUPABASE_DATABASE_URL, connectionTimeoutMillis: 12000 });
try {
  if (!process.env.SUPABASE_DATABASE_URL) throw new Error('SUPABASE_DATABASE_URL is missing.');
  await client.connect();
  const { rows } = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
  console.log(JSON.stringify({ connected: true, tables: rows.map(row => row.tablename) }));
} catch (error) {
  console.error(JSON.stringify({ connected: false, code: error.code, message: error.message.replaceAll(process.env.SUPABASE_DATABASE_URL ?? '__unset__', '[redacted]') }));
  process.exitCode = 1;
} finally {
  await client.end();
}
