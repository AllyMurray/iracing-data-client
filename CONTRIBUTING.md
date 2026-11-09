# Contributing

## Getting Started

1. Fork and clone the repository
2. Use Node.js 24.11 or newer within the 24.x line (`nvm use` reads `.nvmrc`) and install the pinned Bun build: `npm install --global "bun@$(cat .bun-version)"`
3. Install dependencies: `bun install --frozen-lockfile`
4. Copy the example env file: `cp .env.example .env`
5. Fill in your iRacing OAuth credentials (see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials))

`.bun-version` and both manifests pin the same exact Bun release. Install this
exact npm build; a moving `canary` tag can change native tooling behavior.
The library and `docs-site` remain separate projects with independent `bun.lock`
files. Install docs dependencies with `cd docs-site && bun install --frozen-lockfile`.

Library consumers are supported on Node.js 22 and newer (`>=22.0.0`), including
odd-numbered releases such as 23 and 25. CI runs offline unit tests on Bun and
builds on Node.js 24, then validates installed packages and encrypted environment
compatibility on Node.js 22 and 24 LTS. The matrix is a subset of supported
consumer runtimes. Build, docs and release tools also require Node.js 24.

Bun supplies formatting, source typechecking and `bun:test`. Standalone Oxlint
with oxlint-tsgolint supplies linting on stable Bun.
Standalone tsdown builds ESM/CommonJS and declarations with the TypeScript 6
compiler API. The explicit TS7 native compiler (`@typescript/native`, 7.0.2)
remains available for compatibility checks. The `typescript` dependency is a
TypeScript 6 compatibility alias for tools needing the JavaScript compiler API;
its CLI is `tsc6`. Packed consumer fixtures compile with both versions. Standard
Vite remains for the installed-package browser compatibility checks. Size Limit
has a local patch to resolve plugins from the declaring manifest under isolated
installs; commit that patch with its lockfile entry until upstream adopts the fix.
The tsdown override selects `rolldown-plugin-dts` 0.30.0. Its native generator
requires the TypeScript 7.1 API; the reviewed TS7.0 compiler is CLI-only and
installed under an alias. Use the TS6 `tsc` declaration generator until a reviewed
compiler upgrade can supply the new API. Installed-package tests compile the
resulting declarations with both TS6 and TS7.

Dependency installation settings live in each project's `bunfig.toml`. Both
projects wait 24 hours before accepting third-party releases, including transitive
dependencies, exact versions and frozen installs. The installation security scanner
also rejects missing publication timestamps. Packages under the owner's
`@http-client-toolkit/*` scope are exempt; their third-party dependencies still wait.
Bun requires explicit package names for this exception. Add new owned packages to
both `minimumReleaseAgeExcludes` arrays before installing them.
The library trusts only the esbuild install script; docs additionally trusts sharp.
Review other scripts before adding them to `trustedDependencies` in the manifest.
Both projects save new dependencies at exact versions. Existing reviewed ranges
remain intentional. Keep both package-manager pins and `.bun-version` equal.
Renovate groups all three Bun declarations and maintains each project’s lockfile.
Run `bun run check:bun-version` and `bun run test:bun-version` when changing pins;
CI checks them before installing dependencies, including release candidates.

`bun install` installs the Husky pre-commit hook. Each commit checks formatting,
lint/types and offline tests through `bun run pre-commit`. Formatting and its
read-only check use identical file scopes. Oxlint preserves the existing
rules, overrides and type-aware checks in `.oxlintrc.json`. Calling its binary
directly avoids recursive script fallback on Bun releases without native lint. Formatting preserves existing style, disables
import/manifest sorting and excludes Changesets changelogs and generated assets.
Run `bun run format:check` before making formatting changes; use targeted
`bun fmt <files>` to avoid unrelated changes. CI sets `HUSKY=0` during releases.

Run `bun run test:dependency-policy` to exercise ranges, exact versions, missing
timestamps, frozen installs and the toolkit exception in both projects against
a local registry, without contacting the iRacing API.

## Environment Variables

### Encrypting with dotenvx (recommended)

We use [dotenvx](https://dotenvx.com) to encrypt `.env` files so secrets never exist as plaintext on disk:

```bash
# Encrypt your .env file
bunx dotenvx encrypt

# Store the private key in your macOS Keychain
security add-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w "$(grep '^DOTENV_PRIVATE_KEY=' .env.keys | cut -d'=' -f2)"
```

Once the key is in your keychain, you can delete `.env.keys` from disk.

To run commands that need env vars, prefix with the key from keychain:

```bash
DOTENV_PRIVATE_KEY=$(security find-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w) bun run test:integration
```

To avoid typing the prefix every time, add an alias to your `~/.zshrc`:

```bash
alias iracing-env='DOTENV_PRIVATE_KEY=$(security find-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w)'
```

Then just:

```bash
iracing-env bun run test:integration
iracing-env bun run sdk:test
```

### Rotating keys

If your private key is compromised, rotate it and update your keychain and GitHub secrets:

```bash
# Generate a new key pair and re-encrypt all values
bunx dotenvx rotate

# Update the keychain entry
security delete-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY"
security add-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w "$(grep '^DOTENV_PRIVATE_KEY=' .env.keys | cut -d'=' -f2)"
```

After rotating, update the `DOTENV_PRIVATE_KEY` and `DOTENV_ENV_FILE` GitHub repository secrets to match.

## Scripts

- `bun run build` - Check toolchain consistency and build ESM/CommonJS plus TS7 declarations with `tsdown`
- `bun run dev` - Rebuild the library in watch mode with `tsdown --watch`
- `bun run test` - Run offline unit tests with `bun:test`; append `--watch` for watch mode
- `bun run check` - Check formatting, lint, and types with native `bun fmt` and `bun lint`
- `bun run lint` - Run the same static checks without the formatting check
- `bun run format:check` - Read-only formatting check using the same scope as `format`
- `bun run format` - Format source, generator scripts, package checks, and tsdown config with `bun fmt`
- `bun run check:toolchain` - Check the Bun pins and TS7/TS6 compiler setup
- `bun run test:build:size` - Check raw and gzip ESM/CommonJS size budgets against the existing build
- `bun run test:package` - Build, enforce size budgets, pack, and check installed ESM/CommonJS exports, browser bundling, and TS6/TS7 declarations
- `bun run test:package:artifacts` - Check the existing build on the current Node.js runtime without rebuilding
- `bun run test:dependency-policy` - Verify both projects enforce the dependency release-age policy
- `bun run test:audit-policy` - Test audit regression detection and error handling
- `bun run test:release` - Test automatic runtime Changesets, release preparation, and recovery without publishing
- `bun run test:env` - Verify dotenvx v1 encrypted-file compatibility and v2 encryption using synthetic credentials
- `bun run test:integration` - Run integration tests against the live API
- `bun run typecheck` - Run native Bun source typechecking
- `bun run sdk:generate` - Generate the client from API documentation
- `bun run sdk:test` - Test the client with live API calls
- `bun run credentials:keepalive` - Make one authenticated Data API request per enabled OAuth client pair

The package check installs the tarball into a temporary project outside the
checkout, so it requires registry access to install runtime dependencies. Its
client requests use a mock fetch and do not need iRacing credentials. The temporary
project is removed when the check finishes.

The browser check bundles the installed package and fails on unresolved imports
or Node builtin shims. It also verifies the package's `sideEffects: false`
metadata: unused SDK imports disappear and used exports still execute correctly.
Public modules must not perform network requests, register global handlers, or
mutate consumer state at import time. These package checks do not call the live API.

Size Limit checks the emitted SDK code, excluding source maps and external runtime
dependencies: ESM is limited to 185 kB raw / 28 kB gzip, and CommonJS to 225 kB raw /
30 kB gzip. These budgets allow modest growth from the measured 168.1/200.84 kB
raw and 24.66/26 kB gzip baselines. CI checks both builds, and release/recovery
runs check sizes before publication. Review the cause of a size regression before
raising a budget.

`bun run test` excludes
credential-dependent integration tests; `bun run test:integration` loads credentials
through dotenvx and selects the live `*.integration.test.ts` files.

To validate documentation locally, run `bun install --cwd docs-site --frozen-lockfile`
followed by `bun run docs:build`. PR CI runs this docs build separately from the
library checks, using the documentation project's own lockfile.

PR CI audits the library and docs lockfiles against the exact PR base commit,
using current registry advisories for both. Existing findings remain visible in
the job summary, so incremental fixes can merge while other findings remain.
New advisories, newly affected versions, increased severity, or new runtime
exposure fail CI. Registry errors, malformed reports, and missing baseline data
also fail. The comparison uses temporary lockfile copies without installing
packages or running hooks. Reproduce it with
`node scripts/audit-dependencies.mjs . <base-commit-sha>` and
`node scripts/audit-dependencies.mjs docs-site <base-commit-sha>`.

The separate `dependency security` workflow runs full `bun audit` checks for
both projects on main pushes, daily at 07:17 UTC, and on manual dispatch. It
includes development and transitive dependencies. Release and docs deployment
call this workflow and require both audits to pass before starting. Recovery
also audits the restored candidate, and normal release preparation audits the
versioned lockfile before publishing. Keep these full audits out of required
PR checks; the PR regression checks allow incremental security fixes to land.
Narrowly scoped overrides should explain the affected parent and patched version.

A scoped override currently removes a documentation audit finding:
`postcss-nested` uses `postcss-selector-parser` 7.1.6 or newer. The docs build
validates the parser override. Remove it when the parent package adopts a safe
version itself.

The dotenvx v2 compatibility check uses a public synthetic v1 fixture and a fresh
v2 encryption round trip in a temporary directory. It never loads repository
credentials or connects to the live API. The credential-dependent integration
tests remain a separate release gate.

## Dependency maintenance with Renovate

`renovate.json` manages the root and docs manifests and their independent Bun
lockfiles, both package-manager pins, and GitHub Actions.
Ordinary branches are scheduled between midnight and 06:00 Europe/London, with
two new PRs per hour and no concurrent PR cap, matching comic-vine. Nightly
lockfile maintenance has higher priority than ordinary version updates so
transitive fixes can proceed while other PRs remain open. Maintenance PRs
require review and successful CI. The schedule is a permitted window for
Renovate runs, not a promise that an update appears at midnight.

Third-party npm releases must be at least one day old and have a publication
timestamp, matching Bun's install policy. Owned `@http-client-toolkit/*` releases
skip this delay, but their third-party dependencies still wait at installation.
GitHub Actions, Bun pins and compatible HTTP toolkit updates have separate groups. Runtime
and docs dependencies, major upgrades, and pre-1.0 tools require manual review.
Node types stay on 26.x, the compatibility compiler stays on TS6, and the native
compiler stays on TS7.0.x. A native compiler update also requires reviewing its
explicit version check in `scripts/check-toolchain.mjs`.

Renovate does not change the consumer `engines.node` range, the Node 22/24 CI
matrix, or the Node 24 development runtime. Those remain deliberate decisions.

The Renovate App is active; track updates in the
[Dependency Dashboard](https://github.com/AllyMurray/iracing-data-client/issues/35).
Stable `size-limit` / `@size-limit/file` patch updates may automerge after a
three-day release delay, matching comic-vine. Main requires successful
`validate (22.x)`, `validate (24.x)`, and `docs` checks with no bypass actors;
protected-branch tests verified rejection of unchecked commits and acceptance
after successful CI. All other updates remain manual, including runtime and
docs dependencies, release/credential tooling, minors, majors, and pre-1.0 tools.
The path-filtered Renovate validation workflow is not a required check on all PRs.

Security alerts create PRs with an additional `security` label outside the
overnight schedule and ordinary PR limits, without waiting for Renovate's
release-age check. They still require review and successful CI.
They do not bypass Bun's strict one-day install policy: a brand-new fix can
produce an artifact/install failure until it ages. Wait and retry the update,
or explicitly review a temporary package-specific exception in the affected
`bunfig.toml`, remove it once the fix has aged, and keep all other
packages covered. Renovate lockfile refreshes are also subject to Bun's policy.
Do not merge an ungenerated lockfile or a PR with an audit regression. Existing
audit findings may remain while incremental fixes merge; publication and docs
deployment wait until both projects have clean full audits.

The `dependency graph` workflow generates an SPDX inventory from each committed
lockfile on PRs and main pushes, without installing dependencies. Main runs
submit both inventories to GitHub using distinct manifest paths and correlators;
PRs only upload artifacts. The inventory reads the committed Bun locks and
includes development and transitive dependencies. Enable the GitHub dependency
graph and Dependabot alerts, and grant Renovate read access to those alerts for
security PRs. Repository workflow files do not change those settings.

Future peer dependency updates widen supported ranges and require manual review.
The Bun version pins are reviewed together, including `.bun-version`. Standalone
tsdown updates join the reviewed build tooling group. Vite is retained for
browser compatibility checks. Unit tests use `bun:test` without Vitest.
Only the stable size tooling patches listed above are eligible for automerge.

Validate configuration changes with the same pinned validator used in CI:

```bash
bunx --package=renovate@44.209.0 renovate-config-validator --strict renovate.json
```

The validator runs in a temporary Bun installation. Keep the repository's
trusted dependency policies unchanged when running it.

For read-only dependency discovery, stage the config and run:

```bash
LOG_LEVEL=debug bunx --package=renovate@44.209.0 renovate --platform=local --dry-run=extract
```

Inspect both Bun lockfile associations, the package-manager pins, and the
workflow dependencies.
A local dry run does not create branches or prove App
onboarding; GitHub dependency lookups may be skipped without an App/token.
Update the validator pin deliberately when adopting new Renovate options.

## Code Generation

The client is auto-generated from iRacing's API documentation:

```bash
bun run sdk:generate
```

This creates:
- Individual service files in `src/[service]/service.ts`
- Type definitions in `src/[service]/types.ts`
- Main export file `src/index.ts`
- HTTP client with authentication in `src/client.ts`

Change generator templates alongside generated code. The generator formats only
the files it writes using the pinned native Bun formatter, so a second generation must
produce no diff. Tests import from `bun:test`. Linting covers both generated
and hand-written code; the few scoped exceptions in `.oxlintrc.json` preserve
existing query coercion, diagnostic fallbacks, and public OAuth code types.
Samples, build outputs, and the independent docs project are excluded from root
linting and formatting.
The packed consumer TypeScript fixture is formatted here but typechecked only
after installation into its temporary project, so `bun run check` also works before
the first library build.

## CI / GitHub Actions

Main history is protected against deletion and force-pushes. The required-check
ruleset requires `validate (22.x)`, `validate (24.x)`, and `docs` from GitHub Actions,
with the branch up to date and no bypass actors. Both rulesets are active.
The candidate-CI release flow below supplies checks for version commits before
they are pushed to main. The path-filtered
Renovate config check is not required on unrelated PRs.

### Releases

Changesets v3 runs on the Node 24 development/release runtime. Consumer support
remains Node `>=22.0.0`; CI tests Node 22 and 24. Add a Changeset with
`bunx changeset` for consumer-facing code changes. Runtime dependency
updates automatically receive a patch Changeset during release preparation.
Add a manual minor or major Changeset when the SDK change needs a larger bump;
an upstream major version alone does not determine the SDK's version. Tooling,
CI, and contributor-documentation changes do not need a publishing Changeset.
The workflow skips publication when there are no releasing Changesets after
runtime comparison, including when only empty Changesets remain.

`scripts/prepare-runtime-release.mjs`, adapted from comic-vine, compares root
runtime/optional dependencies, peer requirements, and the locked runtime graph
with the latest reachable `iracing-data-client@*` release tag. It uses
a shared lockfile graph reader that supports Bun and historical pnpm locks,
without installing historical packages. Transitive runtime lockfile updates are
included; development tooling, package-manager, docs, and Actions changes alone
do not publish the SDK. Missing release history or an incomplete graph fails
the workflow. All runtime changes since the tag are covered, including updates
merged while audits prevented publishing.

The generated `.changeset/auto-runtime-dependencies.md` is consumed alongside
manual Changesets in the same version commit. A manual minor or major bump takes
precedence. This retains the original workflow commit as the recovery base and
the new release tag becomes the next comparison baseline. Recovery reuses the
saved candidate without generating a fresh Changeset or changing its archive.

The `release.yml` workflow runs on `main` and serializes release runs without
cancelling an active release. After both full dependency audits pass, it:

1. Prepares an automatic runtime dependency Changeset when needed, runs the
   locally installed Changesets CLI, refreshes the Bun lockfile, and
   creates a local version commit and `iracing-data-client@<version>` tag.
2. Builds the versioned package, checks service return types, runs unit tests,
   packs with `bun pm pack`, tests that exact tarball in an isolated consumer, and
   runs the credential-dependent live API integration tests.
3. Saves a `release-candidate` Actions artifact **before publishing**. It contains
   only the tarball, an incremental Git bundle containing the release commit/tag,
   and metadata with the tarball's SHA-512 integrity, source run, and base commit.
   The encrypted environment file and credentials are not included.
4. Pushes `release-candidate/<version>` and explicitly dispatches `ci.yml` on that
   branch. It waits for a new successful run on the exact version commit, including
   Node 22, Node 24, and docs. This is necessary because a branch pushed using
   `GITHUB_TOKEN` does not itself trigger another push workflow. Release permissions
   include `actions: write` for this dispatch. A failed or incomplete run stops
   publication; use recovery after fixing a transient failure.
   GitHub does not count `workflow_dispatch` job checks toward branch rulesets,
   so a final CI job reports matching commit statuses using `statuses: write`.
   It reports success only for a single completed successful job with the expected
   name and exact commit SHA; missing, skipped, or failed jobs report failure.
   Ordinary PR and push runs continue to use their native job checks.
5. Checks npm and GitHub for the version/release. Only HTTP 404 means missing;
   authentication, network, and server failures stop the run. An existing npm
   version must have exactly the saved tarball's integrity to be reused.
6. Publishes the explicit tarball with `npm publish --provenance --access public`
   using the existing GitHub OIDC trusted publisher, then pushes the version
   commit and its tag atomically. Finally it creates a GitHub release using the
   verified existing tag, or skips an existing completed release. It removes the
   temporary candidate branch only if it still points to the saved commit.

npm performs publication to retain the existing trusted publishing behavior. The workflow keeps its existing filename and `id-token:
write` permission, and removes an inherited `NODE_AUTH_TOKEN` from the publish
process. It never adds a registry token. Both normal and recovery runs must pass
the live API gate before publication/finalization. Restored `.env` files are
removed even when a test fails.

### Documentation deployment

After the release job succeeds, it calls the reusable `Deploy Documentation`
workflow. Every package release deploys docs from the exact version commit.
Docs-only changes under `docs-site/` or changes to the docs deployment workflow
also deploy without a package bump. Other development-only changes deploy
neither a package nor docs. Manual release runs refresh docs after success.
Failed audits, builds, tests, or publication block that run's automatic deployment.

The docs workflow audits both projects at its selected commit before building
and deploying. It is called directly because writes using `GITHUB_TOKEN` do not
trigger downstream release events. To retry only Pages, manually run
`Deploy Documentation` on main. Successful recovery deploys the current main
commit, which may be newer than the restored release, to avoid rolling docs back.

### Recovering an interrupted release

If a run fails **before** uploading `release-candidate`, it has not published
anything. Fix the cause and run the release workflow on `main` again. If the
artifact exists, use **Actions → release → Run workflow**, select `main`, and
set `recovery_run_id` to the original run's numeric ID (from its URL). Use this
explicit recovery input instead of GitHub's ordinary “Re-run jobs” button after
publication may have started. A rerun cannot overwrite the original artifact.
Recovery does not require pending Changesets.

Recovery verifies that the artifact belongs to this repository's completed
`release.yml` run on `main`, restores its exact commit/tag, verifies the tarball
integrity and package metadata, and reruns the test gates, full dependency audits,
and candidate CI. It publishes the saved archive only if npm still lacks that
version. If npm already
has the matching archive, it finishes the Git push and/or GitHub release without publishing
again. If the Git commit/tag were already pushed and only the GitHub release is
missing, recovery works even after later commits have reached `main`.

If `main` advanced **before the release commit/tag were pushed**, recovery stops
for manual reconciliation; it never force-pushes or silently assigns a different
archive to an existing version. Download the original artifact, fetch its bundle
into a clean checkout, inspect the saved commit and current `main`, and merge the
saved release commit into `main` while preserving that commit and its tag. Resolve
conflicts deliberately, retain later work/Changesets, and push the merge and saved
tag atomically. Then dispatch recovery with the original run ID. Do not cherry-pick
the release into a different commit and move its tag, or republish/bump past a
partial release without reconciling the recorded version first.

A failed candidate CI run retains its temporary branch and artifact for diagnosis.
If the failure requires code changes, first verify that npm never accepted the
version and no release tag/main version commit was pushed. Then deliberately
remove the abandoned candidate branch and start a new release from the corrected
`main`. If publication may have succeeded, use recovery or manual reconciliation
instead of discarding that candidate.

Artifacts are retained for 90 days. Keep the original candidate when investigating
an interrupted release. If it has expired, a tag conflicts, or npm's integrity
differs, stop and inspect the published package and Git history manually; the
workflow deliberately refuses to guess a replacement. Runs made by the previous
workflow have no recovery artifact and also require manual inspection.

Run `bun run build && bun run test:release` to validate preparation and recovery
without publishing. This uses real Changesets, tarballs, tags, bundles, and local
bare Git remotes, and substitutes npm/GitHub writes. CI runs it on Node 24. The
suite covers automatic runtime and transitive changes, development-only no-ops,
manual bump precedence, no-change releases, publication/push/release failures,
matching and conflicting existing versions, later commits, lookup outages,
candidate CI failures, and candidate branch cleanup. It does not use live
credentials or alter this checkout's version/tags.

In CI, the encrypted `.env` file is restored from a GitHub secret and decrypted by dotenvx at runtime. This means adding or changing env vars only requires updating a single secret — the workflow YAML never needs to change.

Two repository secrets are required:

- **`DOTENV_PRIVATE_KEY`** — the decryption key (retrieve from your keychain)
- **`DOTENV_ENV_FILE`** — the full content of your encrypted `.env` file

To update `DOTENV_ENV_FILE`, copy the content of your local `.env` and paste it as the secret value in GitHub Settings > Secrets > Actions.

### Credential keepalive

The weekly `iRacing Credential Keepalive` workflow runs `bun run credentials:keepalive` to prevent unused OAuth credentials from expiring.

Add shared account credentials and keepalive client pairs to the encrypted `.env` file:

```bash
IRACING_USERNAME=your-email@example.com
IRACING_PASSWORD=your-password
IRACING_KEEPALIVE_CLIENTS='[{"name":"project-a","clientId":"client-id-a","clientSecret":"client-secret-a","enabled":true},{"name":"project-b","clientId":"client-id-b","clientSecret":"client-secret-b","enabled":false}]'
```

Each enabled pair requests an OAuth token and makes one authenticated request to `/data/member/info`. Omit `enabled` or set it to `true` to run a pair; set it to `false` to keep a pair configured but skipped.

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run `bun run check`, `bun run typecheck`, `bun run test`, and `bun run test:package`; regenerate the SDK when changing templates and build the docs when changing documentation
4. For consumer-facing code changes or dependency changes requiring more than an automatic patch, add a Changeset: `bunx changeset`
5. Open a Pull Request
