import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vite-plus';

const require = createRequire(import.meta.url);
const nativePackage = dirname(require.resolve('@typescript/native/package.json'));
const { default: getExePath } = require(join(nativePackage, 'lib/getExePath.js'));

export default defineConfig({
  // Samples reach 44 MB; keep them out of the JavaScript export transformer.
  json: { stringify: true, namedExports: false },
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['**/*.integration.test.ts'],
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc'],
    categories: { correctness: 'error' },
    env: { builtin: true, es2024: true, node: true },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // Keep existing coercion of caller-supplied query values and diagnostic
        // fallbacks; changing these behaviors is outside this tooling migration.
        files: [
          'src/client.ts',
          'scripts/probe-season-team-standings.ts',
          'scripts/scrape-api-samples.ts',
          'build-tests/fixtures/runtime.cjs',
        ],
        rules: { 'typescript/no-base-to-string': 'off' },
      },
      {
        // Public OAuth codes document known literals but accept future codes.
        files: ['src/auth/errors.ts'],
        rules: { 'typescript/no-redundant-type-constituents': 'off' },
      },
    ],
    ignorePatterns: [
      'lib/**',
      'dist/**',
      'docs-site/**',
      'samples/**',
      'node_modules/**',
      // Compiled with TS6/TS7 only after installation into the isolated consumer;
      // it must not resolve against a stale local build during source checks.
      'build-tests/fixtures/consumer.ts',
    ],
  },
  fmt: {
    singleQuote: true,
    printWidth: 100,
    sortPackageJson: false,
    ignorePatterns: ['lib/**', 'dist/**', 'docs-site/**', 'samples/**', 'node_modules/**'],
  },
  pack: {
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
  },
});
