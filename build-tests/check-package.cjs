const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const nodePath = require('node:path');

const root = nodePath.resolve(__dirname, '..');
const temporary = mkdtempSync(nodePath.join(tmpdir(), 'iracing-package-'));
const consumer = nodePath.join(temporary, 'consumer');
const pkg = require('../package.json');

function run(command, args, cwd = consumer) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

try {
  // Packing and installing outside the checkout prevents repository files and
  // development dependencies from hiding missing exports or package contents.
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--tarball'));
  const tarball = args.length
    ? nodePath.resolve(args[1])
    : nodePath.join(temporary, 'iracing-data-client.tgz');
  if (!args.length) run('pnpm', ['pack', '--out', tarball], root);

  mkdirSync(consumer);
  writeFileSync(
    nodePath.join(consumer, 'package.json'),
    JSON.stringify(
      {
        private: true,
        packageManager: pkg.packageManager,
        dependencies: { [pkg.name]: `file:${tarball}` },
      },
      null,
      2,
    ),
  );
  // Consumer resolution must use the same release-age policy as the repository.
  const agePolicy = [
    'minimumReleaseAge',
    'minimumReleaseAgeStrict',
    'minimumReleaseAgeIgnoreMissingTime',
  ].map((setting) => {
    const value = execFileSync('pnpm', ['config', 'get', setting], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    assert.match(value, setting === 'minimumReleaseAge' ? /^\d+$/ : /^(true|false)$/);
    return `${setting}: ${value}`;
  });
  const exclusions = JSON.parse(
    execFileSync('pnpm', ['config', 'get', 'minimumReleaseAgeExclude', '--json'], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
  assert.ok(Array.isArray(exclusions) && exclusions.every((entry) => typeof entry === 'string'));
  agePolicy.push(`minimumReleaseAgeExclude: ${JSON.stringify(exclusions)}`);
  writeFileSync(
    nodePath.join(consumer, 'pnpm-workspace.yaml'),
    `packages:\n  - '.'\n${agePolicy.join('\n')}\n`,
  );
  run('pnpm', ['install', '--ignore-scripts', '--no-frozen-lockfile']);

  copyFileSync(
    nodePath.join(__dirname, 'fixtures/runtime.cjs'),
    nodePath.join(consumer, 'runtime.cjs'),
  );
  run(process.execPath, ['runtime.cjs']);
  run(process.execPath, [nodePath.join(__dirname, 'check-browser.mjs'), consumer]);

  // Check both NodeNext module modes against the installed declarations, using
  // the repository's compiler without exposing its node_modules to the consumer.
  for (const extension of ['mts', 'cts']) {
    copyFileSync(
      nodePath.join(__dirname, 'fixtures/consumer.ts'),
      nodePath.join(consumer, `consumer.${extension}`),
    );
  }
  writeFileSync(
    nodePath.join(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
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
      },
      null,
      2,
    ),
  );
  const compilers = [
    ['TypeScript 6', 'typescript', 'tsc6'],
    ['TypeScript 7', '@typescript/native', 'tsc'],
  ];
  for (const [label, packageName, binary] of compilers) {
    const manifestPath = require.resolve(`${packageName}/package.json`);
    const compiler = require(manifestPath);
    run(process.execPath, [
      nodePath.join(nodePath.dirname(manifestPath), compiler.bin[binary]),
      '--project',
      'tsconfig.json',
    ]);
    console.log(`${label}: installed ESM/CommonJS declaration checks passed`);
  }
  console.log(`Installed package runtime and declaration checks passed on ${process.version}`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
