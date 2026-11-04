import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig } from 'tsdown';

const require = createRequire(import.meta.url);
const nativePackage = dirname(require.resolve('@typescript/native/package.json'));
const { default: getExePath } = require(join(nativePackage, 'lib/getExePath.js'));

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['cjs', 'esm'],
  // Preserve the published file contract: JS maps embed source content;
  // declaration maps would point at source files absent from the tarball.
  dts: { generator: 'tsgo', tsgo: { path: getExePath() }, sourcemap: false },
  sourcemap: true,
  clean: true,
  outDir: 'lib',
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.js',
    dts: format === 'es' ? '.d.mts' : '.d.ts',
  }),
  // Consumer engines must not raise the existing browser syntax target.
  target: 'es2015',
  deps: { resolveDepSubpath: true, neverBundle: true },
  tsconfig: './tsconfig.json',
});
