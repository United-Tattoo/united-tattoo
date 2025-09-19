#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const MIGRATIONS_DIR = join(process.cwd(), 'sql', 'migrations');
const DB_NAME = 'united-tattoo';
const useRemote = process.argv.includes('--remote');

// Gather UP migration files (exclude *_down.sql), sorted lexicographically
const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql') && !f.endsWith('_down.sql'))
  .sort();

if (files.length === 0) {
  console.log('No migration files found in sql/migrations.');
  process.exit(0);
}

for (const f of files) {
  const full = join(MIGRATIONS_DIR, f);
  const args = ['d1', 'execute', DB_NAME, '--file', full];
  if (useRemote) args.splice(2, 0, '--remote');
  console.log(`\nApplying migration: ${f}${useRemote ? ' [--remote]' : ''}`);
  const res = spawnSync('wrangler', args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`Migration failed for ${f}. Aborting.`);
    process.exit(res.status ?? 1);
  }
}

console.log('\nAll migrations applied successfully.');

