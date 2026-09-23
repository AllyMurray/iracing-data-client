import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const manifest = require('../package.json');
const vitePlusPath = require.resolve('vite-plus/package.json');
const vitePlus = require(vitePlusPath);
const core = require('vite/package.json');
const bundledRequire = createRequire(vitePlusPath);
const vitest = bundledRequire('vitest/package.json');
const native = require('@typescript/native/package.json');
const compatibility = require('typescript/package.json');

assert.equal(core.name, '@voidzero-dev/vite-plus-core');
assert.equal(core.version, vitePlus.version, 'Update both Vite+ catalog entries together.');
assert.equal(
  vitest.version,
  vitePlus.dependencies.vitest,
  'Use the Vitest version bundled by Vite+.',
);
assert.equal(manifest.devDependencies.vitest, undefined, 'Import tests from vite-plus/test.');
assert.equal(native.version, '7.0.2', 'Review the explicit TS7 compiler when updating it.');
assert.equal(compatibility.name, '@typescript/typescript6');
console.log(
  `Vite+ ${vitePlus.version}, matching core, Vitest ${vitest.version}, TypeScript ${native.version}`,
);
