import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['cjs', 'esm'],
  // Preserve the published file contract: JS maps embed source content;
  // declaration maps would point at source files absent from the tarball.
  // The declaration plugin's TS7 backend requires the 7.1 API; our reviewed
  // TS7.0 compiler is CLI-only. Use the installed TS6 API for declarations.
  dts: { generator: 'tsc', sourcemap: false },
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
