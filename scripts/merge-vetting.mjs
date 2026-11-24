#!/usr/bin/env node
// Merge review-mode exports (data/vetting-patches/*.json) into data/vetting.json, then delete the patches.
// A patch is { "<story id>": { "status": "keep|drop|fix|unvetted", "note": "...", "reviewed": "YYYY-MM-DD" } }.
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'data', 'vetting-patches');
const target = path.join(root, 'data', 'vetting.json');
const STATUSES = new Set(['keep', 'drop', 'fix', 'unvetted']);

let vetting = {};
try { vetting = JSON.parse(await readFile(target, 'utf8')); } catch {}
let files = [];
try { files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort(); } catch {}
let changed = 0;
for (const f of files) {
  const patch = JSON.parse(await readFile(path.join(dir, f), 'utf8'));
  for (const [id, v] of Object.entries(patch)) {
    if (!v || !STATUSES.has(v.status)) { console.warn(`skip ${f}: ${id} has bad status`); continue; }
    vetting[id] = { status: v.status, note: v.note || '', reviewed: v.reviewed || new Date().toISOString().slice(0, 10) };
    changed++;
  }
  await unlink(path.join(dir, f));
  console.log('merged', f);
}
await writeFile(target, JSON.stringify(vetting, null, 1) + '\n');
console.log(`${changed} vetting changes from ${files.length} patch file(s)`);
