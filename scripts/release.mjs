import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const registry = 'https://registry.npmjs.org';
const artifactName = 'release-candidate';
const sha = /^[a-f0-9]{40}$/;

export function command(cwd, executable, args) {
  const env = { ...process.env };
  // Publishing must use GitHub OIDC, never an inherited registry token.
  if (executable === 'npm') delete env.NODE_AUTH_TOKEN;
  return execFileSync(executable, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trimEnd();
}

export function context(cwd, artifactDir, run = command) {
  return { cwd, artifactDir, run: (exe, args) => run(cwd, exe, args) };
}

function json(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function git(ctx, ...args) {
  return ctx.run('git', args);
}

function clean(ctx) {
  assert.equal(git(ctx, 'status', '--porcelain'), '', 'Release checkout must be clean');
}

export function pending(cwd) {
  return readdirSync(join(cwd, '.changeset')).some(
    (file) => file.endsWith('.md') && file !== 'README.md',
  );
}

export function prepare(ctx) {
  clean(ctx);
  if (!pending(ctx.cwd)) return false;
  const temporary = mkdtempSync(join(tmpdir(), 'iracing-release-plan-'));
  try {
    const plan = join(temporary, 'plan.json');
    ctx.run('pnpm', ['exec', 'changeset', 'status', '--output', plan]);
    const releases = json(plan).releases.filter((release) => release.type !== 'none');
    if (releases.length === 0) return false;
    const pkg = json(join(ctx.cwd, 'package.json'));
    assert.equal(releases.length, 1, 'Only the root package may be released');
    assert.equal(releases[0].name, pkg.name);
    ctx.run('pnpm', ['exec', 'changeset', 'version']);
    ctx.run('pnpm', ['install', '--lockfile-only', '--ignore-scripts']);
    const next = json(join(ctx.cwd, 'package.json'));
    assert.notEqual(next.version, pkg.version);
    const tag = `${next.name}@${next.version}`;
    const changed = git(ctx, 'status', '--porcelain')
      .split('\n')
      .map((line) => line.slice(3));
    assert.ok(
      changed.every(
        (file) =>
          ['package.json', 'pnpm-lock.yaml', 'CHANGELOG.md'].includes(file) ||
          file.startsWith('.changeset/'),
      ),
      'Versioning changed unexpected files',
    );
    git(ctx, 'add', '--', 'package.json', 'pnpm-lock.yaml', 'CHANGELOG.md', '.changeset');
    git(ctx, 'commit', '-m', `chore: release ${tag}`);
    git(ctx, 'tag', tag);
    return true;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function integrity(file) {
  return `sha512-${createHash('sha512').update(readFileSync(file)).digest('base64')}`;
}

export function stage(ctx, { repository, runId }) {
  clean(ctx);
  const pkg = json(join(ctx.cwd, 'package.json'));
  const tag = `${pkg.name}@${pkg.version}`;
  const commit = git(ctx, 'rev-parse', 'HEAD');
  const base = git(ctx, 'rev-parse', 'HEAD^');
  assert.equal(git(ctx, 'rev-parse', `refs/tags/${tag}`), commit);
  mkdirSync(ctx.artifactDir, { recursive: true });
  const tarball = join(ctx.artifactDir, 'package.tgz');
  ctx.run('pnpm', ['pack', '--out', tarball]);
  git(
    ctx,
    'bundle',
    'create',
    join(ctx.artifactDir, 'release.bundle'),
    `refs/tags/${tag}`,
    `^${base}`,
  );
  const candidate = {
    format: 1,
    repository,
    runId,
    name: pkg.name,
    version: pkg.version,
    tag,
    base,
    commit,
    integrity: integrity(tarball),
  };
  writeFileSync(join(ctx.artifactDir, 'release.json'), `${JSON.stringify(candidate, null, 2)}\n`);
  verify(ctx);
  return candidate;
}

export function verify(ctx) {
  const candidate = json(join(ctx.artifactDir, 'release.json'));
  assert.equal(candidate.format, 1);
  assert.equal(candidate.name, 'iracing-data-client');
  assert.match(candidate.version, /^\d+\.\d+\.\d+$/, 'Only stable releases are supported');
  assert.equal(candidate.tag, `${candidate.name}@${candidate.version}`);
  assert.match(candidate.base, sha);
  assert.match(candidate.commit, sha);
  const tarball = join(ctx.artifactDir, 'package.tgz');
  assert.equal(integrity(tarball), candidate.integrity, 'Release tarball integrity mismatch');
  const packed = JSON.parse(ctx.run('tar', ['-xOf', tarball, 'package/package.json']));
  assert.equal(packed.name, candidate.name);
  assert.equal(packed.version, candidate.version);
  const committed = JSON.parse(git(ctx, 'show', `${candidate.commit}:package.json`));
  assert.equal(packed.engines.node, committed.engines.node);
  assert.equal(committed.version, candidate.version);
  assert.equal(git(ctx, 'rev-parse', `${candidate.commit}^`), candidate.base);
  assert.equal(
    git(ctx, 'rev-parse', `refs/tags/${candidate.tag}`),
    candidate.commit,
    'Release tag conflicts with candidate',
  );
  return candidate;
}

// A 404 is the only response that means "absent". Auth/network/server failures
// must stop the release, not accidentally turn into a publish/create attempt.
export async function lookup(url, headers = {}, fetcher = fetch) {
  const response = await fetcher(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Release lookup failed: HTTP ${response.status} from ${url}`);
  return response.json();
}

export function restore(ctx, candidate) {
  clean(ctx);
  assert.match(candidate.commit, sha);
  assert.match(candidate.base, sha);
  assert.match(candidate.tag, /^iracing-data-client@\d+\.\d+\.\d+$/);
  const bundle = join(ctx.artifactDir, 'release.bundle');
  git(ctx, 'bundle', 'verify', bundle);
  assert.equal(
    git(ctx, 'bundle', 'list-heads', bundle),
    `${candidate.commit} refs/tags/${candidate.tag}`,
  );
  // No force: an existing, conflicting release tag is an error.
  git(ctx, 'fetch', bundle, `refs/tags/${candidate.tag}:refs/tags/${candidate.tag}`);
  verify(ctx);
  git(ctx, 'checkout', '--detach', candidate.commit);
}

export async function recover(ctx, repository, runId, githubHeaders, fetcher = fetch) {
  assert.match(runId, /^\d+$/, 'Recovery requires the original release run ID');
  const source = await lookup(
    `https://api.github.com/repos/${repository}/actions/runs/${runId}`,
    githubHeaders,
    fetcher,
  );
  assert.ok(source, 'Release run not found');
  assert.equal(source.path, '.github/workflows/release.yml');
  assert.equal(source.head_branch, 'main');
  assert.ok(['push', 'workflow_dispatch'].includes(source.event));
  assert.equal(source.status, 'completed', 'Wait for the original release run to finish');
  assert.equal(source.repository.full_name, repository);
  ctx.run('gh', [
    'run',
    'download',
    runId,
    '--repo',
    repository,
    '--name',
    artifactName,
    '--dir',
    ctx.artifactDir,
  ]);
  const candidate = json(join(ctx.artifactDir, 'release.json'));
  assert.equal(candidate.repository, repository);
  assert.equal(candidate.runId, runId);
  assert.equal(
    candidate.base,
    source.head_sha,
    'Candidate must originate from the release run checkout',
  );
  restore(ctx, candidate);
}

export function checkRemote(ctx, candidate) {
  git(ctx, 'fetch', 'origin', 'main');
  const main = git(ctx, 'rev-parse', 'FETCH_HEAD');
  const tags = git(
    ctx,
    'ls-remote',
    'origin',
    `refs/tags/${candidate.tag}`,
    `refs/tags/${candidate.tag}^{}`,
  );
  const tagLines = tags ? tags.split('\n') : [];
  const remoteTag = tagLines.find((line) => line.endsWith('^{}')) ?? tagLines[0];
  if (remoteTag)
    assert.equal(
      remoteTag.split(/\s/)[0],
      candidate.commit,
      'Remote release tag conflicts with candidate',
    );
  if (main === candidate.base) return true;
  assert.ok(
    remoteTag,
    'main advanced before release commit/tag were pushed; reconcile the saved candidate manually',
  );
  git(ctx, 'merge-base', '--is-ancestor', candidate.commit, main);
  return false;
}

// GitHub's built-in Actions app cannot bypass a personal-repository ruleset.
// Run the normal CI workflow against the exact version commit before publishing.
export async function validateCandidateCi(ctx, { repository, wait = delay, attempts = 80 }) {
  clean(ctx);
  const candidate = verify(ctx);
  assert.equal(candidate.repository, repository);
  assert.equal(git(ctx, 'rev-parse', 'HEAD'), candidate.commit);
  checkRemote(ctx, candidate);
  const branch = `release-candidate/${candidate.version}`;
  git(ctx, 'push', 'origin', `${candidate.commit}:refs/heads/${branch}`);
  const endpoint = `repos/${repository}/actions/workflows/ci.yml/runs?branch=${encodeURIComponent(branch)}&event=workflow_dispatch&per_page=100`;
  const runs = () => JSON.parse(ctx.run('gh', ['api', endpoint])).workflow_runs;
  const previous = new Set(runs().map((run) => run.id));
  ctx.run('gh', ['workflow', 'run', 'ci.yml', '--repo', repository, '--ref', branch]);
  for (let attempt = 0; attempt < attempts; attempt++) {
    const run = runs().find(
      (item) =>
        !previous.has(item.id) &&
        item.head_sha === candidate.commit &&
        item.head_branch === branch &&
        item.event === 'workflow_dispatch',
    );
    if (run?.status === 'completed') {
      assert.equal(run.conclusion, 'success', `Candidate CI failed: ${run.html_url}`);
      const { jobs } = JSON.parse(
        ctx.run('gh', ['api', `repos/${repository}/actions/runs/${run.id}/jobs?per_page=100`]),
      );
      for (const name of ['validate (22.x)', 'validate (24.x)', 'docs']) {
        assert.ok(
          jobs.some((job) => job.name === name && job.conclusion === 'success'),
          `Candidate CI must pass ${name}`,
        );
      }
      console.log(`Required candidate CI passed: ${run.html_url}`);
      return;
    }
    await wait(15_000);
  }
  throw new Error(
    'Timed out waiting for candidate CI; nothing was published. Retry recovery with the original run ID.',
  );
}

function removeCandidateBranch(ctx, candidate) {
  const ref = `refs/heads/release-candidate/${candidate.version}`;
  const remote = git(ctx, 'ls-remote', 'origin', ref);
  if (!remote) return;
  assert.equal(
    remote.split(/\s/)[0],
    candidate.commit,
    'Candidate branch changed; leave it for manual cleanup',
  );
  // The lease protects any work added since the check; it only deletes our
  // temporary candidate branch and never permits rewriting main or release tags.
  git(ctx, 'push', `--force-with-lease=${ref}:${candidate.commit}`, 'origin', `:${ref}`);
}

export async function publish(ctx, { repository, packageLookup, releaseLookup }) {
  clean(ctx);
  const candidate = verify(ctx);
  assert.equal(candidate.repository, repository);
  assert.equal(git(ctx, 'rev-parse', 'HEAD'), candidate.commit);
  const needsPush = checkRemote(ctx, candidate);
  const published = await packageLookup(candidate);
  const release = await releaseLookup(candidate);
  if (release) {
    assert.equal(release.tag_name, candidate.tag);
    assert.equal(release.draft, false, 'Existing GitHub release is still a draft');
    assert.equal(release.prerelease, false);
    assert.ok(published, 'GitHub release exists but npm version is missing; inspect manually');
  }
  if (published) {
    assert.equal(published.name, candidate.name);
    assert.equal(published.version, candidate.version);
    assert.equal(
      published.dist?.integrity,
      candidate.integrity,
      'Published npm version differs from saved tarball; refusing to reuse version',
    );
    console.log(`${candidate.tag} already published with matching integrity`);
  } else {
    ctx.run('npm', [
      'publish',
      join(ctx.artifactDir, 'package.tgz'),
      '--registry',
      registry,
      '--provenance',
      '--access',
      'public',
    ]);
  }
  // If main races this push, --atomic rejects both refs. The saved candidate is
  // retained for reconciliation; never force-push or publish a replacement.
  if (needsPush)
    git(ctx, 'push', '--atomic', 'origin', 'HEAD:refs/heads/main', `refs/tags/${candidate.tag}`);
  if (!release)
    ctx.run('gh', [
      'release',
      'create',
      candidate.tag,
      '--repo',
      repository,
      '--verify-tag',
      '--title',
      candidate.tag,
      '--generate-notes',
    ]);
  removeCandidateBranch(ctx, candidate);
}

function active(value) {
  if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `RELEASE_ACTIVE=${value}\n`);
  console.log(value ? 'Release candidate ready' : 'No publishing changesets; skipping release');
}

async function main() {
  const operation = process.argv[2];
  const ctx = context(process.cwd(), resolve(process.env.RELEASE_DIR ?? '.tmp/release-candidate'));
  const repository = process.env.GITHUB_REPOSITORY;
  const githubHeaders = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
  };
  switch (operation) {
    case 'pending': {
      const value = pending(ctx.cwd);
      if (process.env.GITHUB_OUTPUT)
        appendFileSync(process.env.GITHUB_OUTPUT, `has_changesets=${value}\n`);
      console.log(`Pending changesets: ${value}`);
      break;
    }
    case 'prepare':
      active(prepare(ctx));
      break;
    case 'stage':
      if (process.env.GITHUB_SHA)
        assert.equal(git(ctx, 'rev-parse', 'HEAD^'), process.env.GITHUB_SHA);
      stage(ctx, { repository, runId: process.env.GITHUB_RUN_ID });
      break;
    case 'recover':
      await recover(ctx, repository, process.env.RECOVERY_RUN_ID, githubHeaders);
      active(true);
      break;
    case 'validate-ci':
      assert.equal(process.env.GITHUB_ACTIONS, 'true');
      assert.equal(process.env.GITHUB_REF, 'refs/heads/main');
      await validateCandidateCi(ctx, { repository });
      break;
    case 'publish':
      assert.equal(
        process.env.GITHUB_ACTIONS,
        'true',
        'Publishing is only allowed in GitHub Actions',
      );
      assert.equal(process.env.GITHUB_REF, 'refs/heads/main');
      assert.ok(existsSync(join(ctx.artifactDir, 'release.bundle')));
      await publish(ctx, {
        repository,
        packageLookup: (candidate) => lookup(`${registry}/${candidate.name}/${candidate.version}`),
        releaseLookup: (candidate) =>
          lookup(
            `https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(candidate.tag)}`,
            githubHeaders,
          ),
      });
      break;
    default:
      throw new Error('Use pending, prepare, stage, recover, validate-ci, or publish');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
