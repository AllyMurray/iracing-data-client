import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../', import.meta.url));

export function checkBunVersion(root = repository) {
  const pinned = readFileSync(resolve(root, '.bun-version'), 'utf8').trim();
  assert.match(
    pinned,
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/,
    '.bun-version must contain one exact Bun release.',
  );
  for (const path of ['package.json', 'docs-site/package.json']) {
    const manifest = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
    assert.equal(manifest.packageManager, `bun@${pinned}`, `${path} must match .bun-version.`);
  }
  return pinned;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Bun version declarations agree: ${checkBunVersion(process.argv[2])}`);
}
