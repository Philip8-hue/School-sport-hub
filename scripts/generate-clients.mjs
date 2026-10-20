import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Keep model definitions identical, so both providers share API types.
const source = fs.readFileSync('prisma/schema.prisma', 'utf8');
const postgres = source.replace('provider = "sqlite"', 'provider = "postgresql"')
  .replace('output   = "../generated/prisma"', 'output   = "../../generated/supabase"');
if (postgres === source || !postgres.includes('provider = "postgresql"')) throw new Error('Could not derive PostgreSQL schema.');
fs.mkdirSync('prisma/supabase', { recursive: true });
fs.writeFileSync('prisma/supabase/schema.prisma', postgres);
const cli = path.resolve('node_modules/prisma/build/index.js');
for (const schema of ['prisma/schema.prisma', 'prisma/supabase/schema.prisma']) {
  const result = spawnSync(process.execPath, [cli, 'generate', '--schema', schema], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
