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
