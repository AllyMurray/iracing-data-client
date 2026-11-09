import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
import { checkBunVersion } from './check-bun-version.mjs';

const pinned = checkBunVersion();
const native = require('@typescript/native/package.json');
const compatibility = require('typescript/package.json');

assert.equal(native.version, '7.0.2', 'Review the explicit TS7 compiler when updating it.');
assert.equal(compatibility.name, '@typescript/typescript6');
console.log(`Bun ${pinned}, TypeScript ${native.version}, TS6 compatibility compiler`);
