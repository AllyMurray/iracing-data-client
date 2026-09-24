import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';

const consumer = process.argv[2];
const entry = join(consumer, 'browser.mjs');
writeFileSync(entry, "export { IRacingDataClient } from 'iracing-data-client';\n");
const result = await build({
  configFile: false,
  root: consumer,
  logLevel: 'error',
  build: {
    write: false,
    target: 'es2015',
    minify: false,
    lib: { entry, formats: ['es'] },
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.message.includes('externalized for browser compatibility')) {
          throw new Error(warning.message);
        }
        defaultHandler(warning);
      },
    },
  },
});
const outputs = Array.isArray(result) ? result : [result];
const chunks = outputs.flatMap((output) => output.output).filter((item) => item.type === 'chunk');
assert.ok(chunks.some((chunk) => chunk.exports.includes('IRacingDataClient')));
for (const chunk of chunks) {
  assert.deepEqual(chunk.imports, [], 'The browser bundle must resolve all runtime dependencies');
  assert.ok(
    !chunk.code.includes('__vite-browser-external'),
    'No Node.js builtin shims in browser output',
  );
}
console.log('Installed package browser bundle passed');

// The published sideEffects flag permits dropping an unused SDK import. Verify
// that the installed package is removed, while a used export still works.
const unusedEntry = join(consumer, 'unused-sdk.mjs');
writeFileSync(
  unusedEntry,
  "import 'iracing-data-client';\nexport const marker = 'consumer-only';\n",
);
const unused = await build({
  configFile: false,
  root: consumer,
  logLevel: 'error',
  build: {
    write: false,
    minify: false,
    lib: { entry: unusedEntry, formats: ['es'] },
  },
});
const unusedChunks = (Array.isArray(unused) ? unused : [unused])
  .flatMap((output) => output.output)
  .filter((item) => item.type === 'chunk');
assert.ok(unusedChunks.length > 0);
assert.ok(unusedChunks.every((chunk) => Object.keys(chunk.modules).length === 1));
const unusedModule = await import(
  `data:text/javascript;base64,${Buffer.from(unusedChunks[0].code).toString('base64')}`
);
assert.equal(unusedModule.marker, 'consumer-only');

const usedEntry = join(consumer, 'used-sdk.mjs');
writeFileSync(usedEntry, "export { OAuthError } from 'iracing-data-client';\n");
const used = await build({
  configFile: false,
  root: consumer,
  logLevel: 'error',
  build: { write: false, minify: false, lib: { entry: usedEntry, formats: ['es'] } },
});
const usedChunks = (Array.isArray(used) ? used : [used])
  .flatMap((output) => output.output)
  .filter((item) => item.type === 'chunk');
assert.equal(usedChunks.length, 1);
const usedModule = await import(
  `data:text/javascript;base64,${Buffer.from(usedChunks[0].code).toString('base64')}`
);
const error = new usedModule.OAuthError('invalid_grant', 'fixture');
assert.equal(error.code, 'invalid_grant');
assert.equal(error.isInvalidGrant, true);
console.log('Installed package unused imports are removed and used exports still work');
