const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const nodePath = require('node:path');

const manifestPath = require.resolve('@dotenvx/dotenvx/package.json');
const manifest = require(manifestPath);
const cli = nodePath.resolve(nodePath.dirname(manifestPath), manifest.bin.dotenvx);
const fixture = require('./fixtures/dotenvx-v1.json');
const temporary = mkdtempSync(nodePath.join(tmpdir(), 'iracing-env-'));
// Use only synthetic values, with no inherited dotenvx/iRacing credentials or
// access to Armor and OS secret stores. Never read the repository's .env files.
const environment = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !key.startsWith('DOTENV') && !key.startsWith('IRACING'),
  ),
);
const isolated = ['--no-armor', '--no-native', '--no-1password', '--no-bitwarden'];

function command(args, privateKey) {
  return spawnSync(process.execPath, [cli, ...args, '--quiet'], {
    cwd: temporary,
    env: { ...environment, ...(privateKey ? { DOTENV_PRIVATE_KEY: privateKey } : {}) },
    encoding: 'utf8',
  });
}

function run(code, privateKey) {
  return spawnSync(
    process.execPath,
    [cli, 'run', ...isolated, '--quiet', '--strict', '--', process.execPath, '-e', code],
    {
      cwd: temporary,
      env: { ...environment, DOTENV_PRIVATE_KEY: privateKey },
      encoding: 'utf8',
    },
  );
}

const assertion = `require('node:assert/strict').equal(process.env.DOTENVX_SMOKE_VALUE,
  ${JSON.stringify(fixture.expected)}); console.log('Environment check passed');`;

function expectSuccess(result) {
  assert.equal(result.status, 0, result.error?.message || result.stderr || result.stdout);
  assert.match(result.stdout, /Environment check passed/);
}

try {
  // Simulate CI restoring a v1-encrypted .env and supplying its key via the
  // environment, without a .env.keys file or access to actual GitHub secrets.
  writeFileSync(nodePath.join(temporary, '.env'), fixture.encryptedEnv);
  expectSuccess(run(assertion, fixture.privateKey));
  assert.equal(
    run('process.exit(17)', fixture.privateKey).status,
    17,
    'dotenvx must forward a failed test command exit status',
  );
  const invalid = run("console.log('CHILD_RAN')", '0'.repeat(64));
  assert.notEqual(invalid.status, 0, 'Strict mode must reject an invalid private key');
  assert.ok(!invalid.stdout.includes('CHILD_RAN'));

  // Also verify the documented local encryption flow still produces a usable
  // key that can be supplied separately, as it is in the release workflow.
  writeFileSync(nodePath.join(temporary, '.env'), `DOTENVX_SMOKE_VALUE=${fixture.expected}\n`);
  const encrypted = command(['encrypt', ...isolated]);
  assert.equal(encrypted.status, 0, encrypted.error?.message || encrypted.stderr);
  const keys = readFileSync(nodePath.join(temporary, '.env.keys'), 'utf8');
  const privateKey = keys.match(/^DOTENV_PRIVATE_KEY="?([a-f0-9]+)"?$/m)?.[1];
  assert.ok(privateKey, 'Encryption must generate a portable private key');
  rmSync(nodePath.join(temporary, '.env.keys'));
  expectSuccess(run(assertion, privateKey));
  console.log('dotenvx v1 compatibility, v2 encryption, and child exit checks passed');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
