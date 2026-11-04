import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const manifest = require('../package.json');
const docs = require('../docs-site/package.json');
const pinned = readFileSync(new URL('../.bun-version', import.meta.url), 'utf8').trim();
const native = require('@typescript/native/package.json');
const compatibility = require('typescript/package.json');

assert.equal(manifest.packageManager, `bun@${pinned}`);
assert.equal(docs.packageManager, manifest.packageManager, 'Keep both Bun pins equal.');
assert.equal(native.version, '7.0.2', 'Review the explicit TS7 compiler when updating it.');
assert.equal(compatibility.name, '@typescript/typescript6');
console.log(`Bun ${pinned}, TypeScript ${native.version}, TS6 compatibility compiler`);
