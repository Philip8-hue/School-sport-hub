import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
assert.equal(config.framework, 'express');
assert.equal(config.buildCommand, 'npm run vercel-build');
assert.equal(config.cleanUrls, false);
let files = 0;
function check(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) check(file);
    else if (entry.name !== '.sports-hub-build') {
      assert.ok(!entry.name.startsWith('.'), 'Private file in public directory');
      assert.ok(!/\.(env|db|ts|log)$/i.test(entry.name), 'Private file in public directory');
      const source = path.join('aul sports', path.relative('public', file));
      assert.deepEqual(fs.readFileSync(file), fs.readFileSync(source), file);
      files++;
    }
  }
}
check('public');
for (const file of ['index.html', 'admin.html', 'register.html', 'design.css', 'homepage-copy.json']) assert.ok(fs.existsSync(path.join('public', file)));
process.env.VERCEL = '1';
process.env.DATABASE_PROVIDER = 'supabase';
process.env.SUPABASE_DATABASE_URL = 'postgresql://localhost:5432/build_check';
const { default: app } = await import('../dist/app.js');
assert.equal(typeof app, 'function');
assert.equal(app.get('trust proxy'), 1);
const invalid = spawnSync(process.execPath, ['--input-type=module', '-e', "await import('./dist/app.js')"], { env: { ...process.env, DATABASE_PROVIDER: 'sqlite' }, encoding: 'utf8' });
assert.notEqual(invalid.status, 0);
assert.match(invalid.stderr, /Set DATABASE_PROVIDER=supabase/);
console.log(`Verified Vercel application export, proxy settings, database guard, and ${files} public assets. No database connection made.`);
