#!/usr/bin/env node
// Replaces @vercel/og wasm/font payloads in .open-next with tiny valid
// placeholders before `wrangler deploy` bundles them. OG images are fully
// prerendered at build time (generateStaticParams + dynamicParams = false),
// so these modules are unreachable at runtime; shipping them costs ~600 KiB
// of the 3 MiB free-plan gzip budget.
import { readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';

const EMPTY_WASM = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
const OG_DIR = `${sep}@vercel${sep}og${sep}`;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

let replaced = 0;
for (const file of walk('.open-next')) {
  if (!file.includes(OG_DIR) || !/\.(wasm|bin)$/.test(file)) continue;
  const kib = (statSync(file).size / 1024).toFixed(0);
  rmSync(file); // break hard links before rewriting
  writeFileSync(file, file.endsWith('.wasm') ? EMPTY_WASM : Buffer.alloc(0));
  console.log(`cf-slim-og: ${file} (${kib} KiB -> placeholder)`);
  replaced += 1;
}

if (replaced === 0) {
  console.error('cf-slim-og: no @vercel/og wasm/bin files found — bundle layout changed?');
  process.exit(1);
}
