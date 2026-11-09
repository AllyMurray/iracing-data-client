import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const guard = new URL('../scripts/check-bun-version.mjs', import.meta.url);

function fixture(t, { pin = '1.4.4', root = `bun@${pin}`, docs = `bun@${pin}` } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'bun-version-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, 'docs-site'));
  writeFileSync(join(directory, '.bun-version'), `${pin}\n`);
  for (const [path, version] of [
    ['package.json', root],
    ['docs-site/package.json', docs],
  ]) {
    writeFileSync(join(directory, path), JSON.stringify({ packageManager: version }));
  }
  return spawnSync(process.execPath, [guard.pathname, directory], {
    encoding: 'utf8',
    cwd: tmpdir(),
  });
}

for (const pin of ['1.4.4', '1.4.4-canary.20261104.1']) {
  await test(`accept synchronized ${pin} pins independently of working directory`, (t) => {
    const result = fixture(t, { pin });
    assert.equal(result.status, 0, result.stderr);
  });
}
/** @type {Array<[string, {pin?: string, root?: string | null, docs?: string}, string]>} */
const invalidPins = [
  ['root drift', { root: 'bun@1.4.3' }, 'package.json'],
  ['docs drift', { docs: 'bun@1.4.3' }, 'docs-site/package.json'],
  ['runtime drift', { pin: '1.4.5', root: 'bun@1.4.4', docs: 'bun@1.4.4' }, 'package.json'],
  ['missing declaration', { root: null }, 'package.json'],
  ['wrong manager', { docs: 'pnpm@1.4.4' }, 'docs-site/package.json'],
  ['range', { pin: '^1.4.4' }, 'one exact Bun release'],
  ['moving tag', { pin: 'canary' }, 'one exact Bun release'],
  ['empty pin', { pin: '' }, 'one exact Bun release'],
];
for (const [name, options, message] of invalidPins) {
  await test(`reject ${name}`, (t) => {
    const result = fixture(t, options);
    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes(message), result.stderr);
  });
}
