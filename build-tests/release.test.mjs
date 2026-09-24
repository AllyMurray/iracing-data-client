import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  checkRemote,
  command,
  context,
  lookup,
  pending,
  prepare,
  publish,
  recover,
  restore,
  stage,
  verify,
  validateCandidateCi,
} from '../scripts/release.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const repository = 'AllyMurray/iracing-data-client';

// Real Changesets, pnpm packing, Git bundles, tags and bare remotes; only npm
// publication and GitHub release creation are replaced. No registry writes or
// live iRacing credentials are used by this suite.
await test('release preparation and recovery', async (t) => {
  const temporary = mkdtempSync(join(tmpdir(), 'iracing-release-test-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const seed = join(temporary, 'seed');
  const artifactDir = join(temporary, 'candidate');
  mkdirSync(seed);
  for (const file of [
    'package.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    '.gitignore',
    '.changeset/config.json',
    '.changeset/README.md',
    'CHANGELOG.md',
    'README.md',
    'lib',
  ]) {
    cpSync(join(root, file), join(seed, file), { recursive: true });
  }
  symlinkSync(join(root, 'node_modules'), join(seed, 'node_modules'), 'dir');
  const seedCtx = context(seed, artifactDir);
  const seedGit = (...args) => seedCtx.run('git', args);
  seedGit('init', '--initial-branch=main');
  seedGit('config', 'user.name', 'Release test');
  seedGit('config', 'user.email', 'release-test@example.invalid');
  seedGit('add', '.');
  seedGit('commit', '-m', 'fixture');

  await t.test('no changesets skips versioning, including empty changesets', () => {
    assert.equal(pending(seed), false);
    assert.equal(prepare(seedCtx), false);
    writeFileSync(join(seed, '.changeset/empty.md'), '---\n{}\n---\n');
    seedGit('add', '.changeset');
    seedGit('commit', '-m', 'empty changeset');
    const before = seedGit('rev-parse', 'HEAD');
    assert.equal(prepare(seedCtx), false);
    assert.equal(seedGit('rev-parse', 'HEAD'), before);
  });

  const original = JSON.parse(readFileSync(join(seed, 'package.json'), 'utf8'));
  writeFileSync(
    join(seed, '.changeset/release-test.md'),
    '---\n"iracing-data-client": patch\n---\n\nRelease test fixture.\n',
  );
  seedGit('add', '.changeset');
  seedGit('commit', '-m', 'patch changeset');
  let candidate;
  await t.test('Changesets v3 produces a versioned tarball, commit and explicit tag', () => {
    assert.equal(prepare(seedCtx), true);
    candidate = stage(seedCtx, { repository, runId: '123' });
    const parts = original.version.split('.').map(Number);
    assert.equal(candidate.version, `${parts[0]}.${parts[1]}.${parts[2] + 1}`);
    assert.equal(seedGit('rev-parse', `refs/tags/${candidate.tag}`), candidate.commit);
    assert.equal(seedGit('status', '--porcelain'), '');
    const packed = JSON.parse(
      seedCtx.run('tar', ['-xOf', join(artifactDir, 'package.tgz'), 'package/package.json']),
    );
    assert.equal(packed.engines.node, '>=22.0.0');
    assert.ok(!JSON.stringify(packed).includes('catalog:'), 'pnpm must resolve catalog references');
    const entries = seedCtx.run('tar', ['-tf', join(artifactDir, 'package.tgz')]);
    assert.ok(entries.includes('package/lib/index.mjs'));
    assert.ok(entries.includes('package/lib/index.d.ts'));
    assert.ok(!entries.includes('.env'));
  });

  let index = 0;
  function scenario() {
    const remote = join(temporary, `remote-${index}.git`);
    const checkout = join(temporary, `checkout-${index++}`);
    seedGit('init', '--bare', '--initial-branch=main', remote);
    seedGit('push', remote, `${candidate.base}:refs/heads/main`);
    seedGit('clone', remote, checkout);
    const state = {
      published: null,
      release: null,
      mutations: [],
      failPush: false,
      failRelease: false,
    };
    const ctx = context(checkout, artifactDir, (cwd, exe, args) => {
      if (exe === 'npm' || exe === 'gh') {
        state.mutations.push([exe, ...args]);
        if (exe === 'npm') {
          assert.deepEqual(args.slice(0, 2), ['publish', join(artifactDir, 'package.tgz')]);
          assert.ok(args.includes('--provenance'));
          state.published = {
            name: candidate.name,
            version: candidate.version,
            dist: { integrity: candidate.integrity },
          };
        } else {
          if (state.failRelease) throw new Error('Simulated GitHub release failure');
          state.release = { tag_name: candidate.tag, draft: false, prerelease: false };
        }
        if (exe === 'npm' && state.afterPublish) state.afterPublish();
        return '';
      }
      if (exe === 'git' && args[0] === 'push' && state.failPush)
        throw new Error('Simulated push failure');
      return command(cwd, exe, args);
    });
    restore(ctx, candidate);
    const options = {
      repository,
      packageLookup: async () => state.published,
      releaseLookup: async () => state.release,
    };
    return { ctx, state, options, remote };
  }

  await t.test('success publishes once and atomically pushes the commit and tag', async () => {
    const { ctx, state, options } = scenario();
    await publish(ctx, options);
    assert.equal(checkRemote(ctx, candidate), false);
    assert.deepEqual(
      state.mutations.map(([exe]) => exe),
      ['npm', 'gh'],
    );
    await publish(ctx, options);
    assert.equal(state.mutations.length, 2, 'Complete release is idempotent');
  });

  await t.test('failure after npm publication resumes without republishing', async () => {
    const { ctx, state, options } = scenario();
    state.failPush = true;
    await assert.rejects(publish(ctx, options), /Simulated push failure/);
    assert.equal(checkRemote(ctx, candidate), true);
    state.failPush = false;
    await publish(ctx, options);
    assert.deepEqual(
      state.mutations.map(([exe]) => exe),
      ['npm', 'gh'],
    );
  });

  await t.test('missing GitHub release is repaired even after main advances', async () => {
    const { ctx, state, options } = scenario();
    state.failRelease = true;
    await assert.rejects(publish(ctx, options), /Simulated GitHub release failure/);
    ctx.run('git', ['config', 'user.name', 'Release test']);
    ctx.run('git', ['config', 'user.email', 'release-test@example.invalid']);
    ctx.run('git', ['commit', '--allow-empty', '-m', 'later main work']);
    ctx.run('git', ['push', 'origin', 'HEAD:main']);
    ctx.run('git', ['checkout', '--detach', candidate.commit]);
    state.failRelease = false;
    await publish(ctx, options);
    assert.equal(state.mutations.filter(([exe]) => exe === 'npm').length, 1);
    assert.ok(state.release);
  });

  await t.test('existing npm version with different integrity is rejected', async () => {
    const { ctx, state, options } = scenario();
    state.published = {
      name: candidate.name,
      version: candidate.version,
      dist: { integrity: 'sha512-different' },
    };
    await assert.rejects(publish(ctx, options), /differs from saved tarball/);
    assert.equal(state.mutations.length, 0);
  });

  await t.test('lookup outages cannot cause publication', async () => {
    const { ctx, state, options } = scenario();
    await assert.rejects(
      publish(ctx, {
        ...options,
        packageLookup: async () => {
          throw new Error('registry unavailable');
        },
      }),
      /registry unavailable/,
    );
    await assert.rejects(
      publish(ctx, {
        ...options,
        releaseLookup: async () => {
          throw new Error('GitHub unavailable');
        },
      }),
      /GitHub unavailable/,
    );
    assert.equal(state.mutations.length, 0);
  });

  await t.test('main moving before publication stops rather than overwrites it', async () => {
    const { ctx, state, options, remote } = scenario();
    const other = join(temporary, 'concurrent-main');
    command(seed, 'git', ['clone', remote, other]);
    command(other, 'git', ['config', 'user.name', 'Release test']);
    command(other, 'git', ['config', 'user.email', 'release-test@example.invalid']);
    command(other, 'git', ['commit', '--allow-empty', '-m', 'concurrent main work']);
    command(other, 'git', ['push', 'origin', 'main']);
    await assert.rejects(publish(ctx, options), /main advanced/);
    assert.equal(state.mutations.length, 0);
  });

  await t.test('conflicting remote tag is rejected before publication', async () => {
    const { ctx, state, options, remote } = scenario();
    seedGit('push', remote, `${candidate.base}:refs/tags/${candidate.tag}`);
    await assert.rejects(publish(ctx, options), /Remote release tag conflicts/);
    assert.equal(state.mutations.length, 0);
  });

  await t.test('an ambiguous npm failure resumes from registry state', async () => {
    const { ctx, state, options } = scenario();
    state.afterPublish = () => {
      throw new Error('connection lost after upload');
    };
    await assert.rejects(publish(ctx, options), /connection lost after upload/);
    assert.equal(checkRemote(ctx, candidate), true);
    state.afterPublish = undefined;
    await publish(ctx, options);
    assert.equal(state.mutations.filter(([exe]) => exe === 'npm').length, 1);
  });

  await t.test('a real concurrent push rejects both release refs atomically', async () => {
    const { ctx, state, options, remote } = scenario();
    state.afterPublish = () => {
      const other = join(temporary, 'racing-main');
      command(seed, 'git', ['clone', remote, other]);
      command(other, 'git', ['config', 'user.name', 'Release test']);
      command(other, 'git', ['config', 'user.email', 'release-test@example.invalid']);
      command(other, 'git', ['commit', '--allow-empty', '-m', 'main raced publication']);
      command(other, 'git', ['push', 'origin', 'main']);
    };
    await assert.rejects(publish(ctx, options), /Command failed/);
    assert.equal(ctx.run('git', ['ls-remote', 'origin', `refs/tags/${candidate.tag}`]), '');
    assert.ok(state.published);
    assert.equal(state.release, null);
  });

  await t.test('recovery accepts only the original completed main release run', async () => {
    const { ctx } = scenario();
    ctx.run('git', ['checkout', '--detach', candidate.base]);
    let downloads = 0;
    const recoveryCtx = context(ctx.cwd, artifactDir, (cwd, exe, args) => {
      if (exe === 'gh') {
        assert.deepEqual(args, [
          'run',
          'download',
          '123',
          '--repo',
          repository,
          '--name',
          'release-candidate',
          '--dir',
          artifactDir,
        ]);
        downloads++;
        return '';
      }
      return command(cwd, exe, args);
    });
    const source = {
      path: '.github/workflows/release.yml',
      head_branch: 'main',
      head_sha: candidate.base,
      event: 'push',
      status: 'completed',
      repository: { full_name: repository },
    };
    const fetchRun =
      (changes = {}) =>
      async () =>
        new Response(JSON.stringify({ ...source, ...changes }), { status: 200 });
    for (const changes of [
      { path: '.github/workflows/ci.yml' },
      { head_branch: 'feature' },
      { event: 'pull_request' },
      { status: 'in_progress' },
      { repository: { full_name: 'other/repo' } },
    ]) {
      await assert.rejects(recover(recoveryCtx, repository, '123', {}, fetchRun(changes)));
    }
    assert.equal(downloads, 0);
    await assert.rejects(
      recover(recoveryCtx, repository, '123', {}, fetchRun({ head_sha: candidate.commit })),
      /Candidate must originate/,
    );
    await recover(recoveryCtx, repository, '123', {}, fetchRun());
    assert.equal(ctx.run('git', ['rev-parse', 'HEAD']), candidate.commit);
  });

  await t.test('candidate CI must validate the exact commit and all required jobs', async () => {
    const { ctx, state, options } = scenario();
    let polls = 0;
    const branch = `release-candidate/${candidate.version}`;
    const oldRun = {
      id: 1,
      head_sha: candidate.commit,
      head_branch: branch,
      event: 'workflow_dispatch',
      status: 'completed',
      conclusion: 'success',
    };
    const ci = context(ctx.cwd, artifactDir, (cwd, exe, args) => {
      if (exe !== 'gh') return command(cwd, exe, args);
      if (args[0] === 'workflow') {
        assert.deepEqual(args, [
          'workflow',
          'run',
          'ci.yml',
          '--repo',
          repository,
          '--ref',
          branch,
        ]);
        return '';
      }
      if (args[1].includes('/jobs?'))
        return JSON.stringify({
          jobs: ['validate (22.x)', 'validate (24.x)', 'docs'].map((name) => ({
            name,
            conclusion: 'success',
          })),
        });
      polls++;
      return JSON.stringify({
        workflow_runs:
          polls === 1 ? [oldRun] : [{ ...oldRun, id: 2, html_url: 'https://example.invalid/ci/2' }],
      });
    });
    await validateCandidateCi(ci, { repository, wait: async () => {}, attempts: 2 });
    assert.equal(polls, 2, 'Do not accept an older CI run as the new dispatch');
    assert.ok(
      ctx.run('git', ['ls-remote', 'origin', `refs/heads/${branch}`]).startsWith(candidate.commit),
    );
    await publish(ctx, options);
    assert.equal(ctx.run('git', ['ls-remote', 'origin', `refs/heads/${branch}`]), '');
    assert.equal(state.mutations.filter(([exe]) => exe === 'npm').length, 1);
  });

  await t.test('failed, incomplete, or wrong-commit candidate CI stops finalization', async () => {
    const { ctx, state } = scenario();
    for (const mode of ['failure', 'missing-job', 'wrong-commit']) {
      let polls = 0;
      const ci = context(ctx.cwd, artifactDir, (cwd, exe, args) => {
        if (exe !== 'gh') return command(cwd, exe, args);
        if (args[0] === 'workflow') return '';
        if (args[1].includes('/jobs?'))
          return JSON.stringify({ jobs: [{ name: 'docs', conclusion: 'success' }] });
        return JSON.stringify({
          workflow_runs:
            polls++ === 0
              ? []
              : [
                  {
                    id: 3,
                    head_sha: mode === 'wrong-commit' ? candidate.base : candidate.commit,
                    head_branch: `release-candidate/${candidate.version}`,
                    event: 'workflow_dispatch',
                    status: 'completed',
                    conclusion: mode === 'failure' ? 'failure' : 'success',
                    html_url: 'https://example.invalid/ci/3',
                  },
                ],
        });
      });
      await assert.rejects(
        validateCandidateCi(ci, { repository, wait: async () => {}, attempts: 1 }),
        /Candidate CI failed|must pass|Timed out/,
      );
    }
    assert.equal(state.mutations.length, 0);
  });

  await t.test('tampered recovery tarball is rejected', () => {
    const copy = join(temporary, 'tampered');
    cpSync(artifactDir, copy, { recursive: true });
    writeFileSync(join(copy, 'package.tgz'), 'not the original archive');
    assert.throws(() => verify(context(seed, copy)), /integrity mismatch/);
  });
});

await test('only HTTP 404 means a package or release is absent', async () => {
  assert.equal(
    await lookup('https://example.invalid', {}, async () => new Response('', { status: 404 })),
    null,
  );
  for (const status of [401, 403, 429, 500, 503]) {
    await assert.rejects(
      lookup('https://example.invalid', {}, async () => new Response('', { status })),
      new RegExp(`HTTP ${status}`),
    );
  }
  await assert.rejects(
    lookup('https://example.invalid', {}, async () => {
      throw new Error('network failure');
    }),
    /network failure/,
  );
});
