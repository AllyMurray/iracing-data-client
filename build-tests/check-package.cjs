const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

const root = resolve(__dirname, '..');
const temporary = mkdtempSync(join(tmpdir(), 'iracing-package-'));
const consumer = join(temporary, 'consumer');
const pkg = require('../package.json');

function run(command, args, cwd = consumer) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

try {
  // Packing and installing outside the checkout prevents repository files and
  // development dependencies from hiding missing exports or package contents.
  run('pnpm', ['pack', '--pack-destination', temporary], root);
  const tarballs = readdirSync(temporary).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one package tarball');

  mkdirSync(consumer);
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({
    private: true,
    packageManager: pkg.packageManager,
    dependencies: { [pkg.name]: `file:${join(temporary, tarballs[0])}` },
  }, null, 2));
  run('pnpm', ['install', '--ignore-scripts', '--no-frozen-lockfile']);

  copyFileSync(join(__dirname, 'fixtures/runtime.cjs'), join(consumer, 'runtime.cjs'));
  run(process.execPath, ['runtime.cjs']);

  // Check both NodeNext module modes against the installed declarations, using
  // the repository's compiler without exposing its node_modules to the consumer.
  for (const extension of ['mts', 'cts']) {
    copyFileSync(join(__dirname, 'fixtures/consumer.ts'), join(consumer, `consumer.${extension}`));
  }
  writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      types: [],
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    },
    files: ['consumer.mts', 'consumer.cts'],
  }, null, 2));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.json']);
  console.log(`Installed package runtime and declaration checks passed on ${process.version}`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
