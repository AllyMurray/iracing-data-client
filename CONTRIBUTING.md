# Contributing

## Getting Started

1. Fork and clone the repository
2. Use Node.js 24.11 or newer within the 24.x line (`nvm use` reads `.nvmrc`) and pnpm 12.4.2, then install dependencies: `pnpm install --frozen-lockfile`
3. Copy the example env file: `cp .env.example .env`
4. Fill in your iRacing OAuth credentials (see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials))

Both `package.json` files pin the same pnpm version. The library and `docs-site`
remain separate pnpm projects with independent lockfiles. Install docs dependencies
with `pnpm --dir docs-site install --frozen-lockfile`.

Library consumers are supported on Node.js 22 and newer (`>=22.0.0`), including
odd-numbered releases such as 23 and 25. CI tests only Node.js 22 and 24 LTS; the
test matrix is a subset of the supported consumer runtimes. CI installs
dependencies, generates code, typechecks, and builds on Node.js 24 before
switching to each tested runtime for unit tests and installed-package checks.
Repository development, docs, and releases also use Node.js 24 and pnpm 12.4.2.
The consumer support range in `engines.node` does not lower the requirements of
development, build, or release tooling.

Vite+ 0.3.2 provides packaging, tests, linting, and formatting. Its `vite` core
alias and `vite-plus` version are pinned together in the pnpm catalog; update both
and run `pnpm check:toolchain` when upgrading.

TypeScript 7.0.2 is installed as `@typescript/native` and supplies `tsc` for
typechecking and the native compiler used explicitly by `vp pack`. The
`typescript` dependency is a TypeScript 6 compatibility alias for tools that
still need the JavaScript compiler API; its CLI is `tsc6`. The packed consumer
fixtures compile with both versions. The independent Astro docs project keeps
its own compatible toolchain.

Dependency installation settings live in each project's `pnpm-workspace.yaml`.
Both projects wait 24 hours before accepting third-party package releases,
including transitive dependencies, exact versions, and frozen lockfile installs.
Missing publication timestamps are rejected. Packages under the repository
owner's `@http-client-toolkit/*` scope are exempt from the delay; their third-party
dependencies are still checked. The library permits the esbuild install script;
docs additionally permits sharp. Review other dependency build scripts before
adding them to `allowBuilds`.

Run `pnpm test:dependency-policy` to exercise these settings against a local test
registry. It checks ranges, exact versions, missing timestamps, frozen installs,
and the toolkit exception in both projects without contacting the iRacing API.

## Environment Variables

### Encrypting with dotenvx (recommended)

We use [dotenvx](https://dotenvx.com) to encrypt `.env` files so secrets never exist as plaintext on disk:

```bash
# Encrypt your .env file
npx @dotenvx/dotenvx encrypt

# Store the private key in your macOS Keychain
security add-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w "$(grep '^DOTENV_PRIVATE_KEY=' .env.keys | cut -d'=' -f2)"
```

Once the key is in your keychain, you can delete `.env.keys` from disk.

To run commands that need env vars, prefix with the key from keychain:

```bash
DOTENV_PRIVATE_KEY=$(security find-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w) pnpm test:integration
```

To avoid typing the prefix every time, add an alias to your `~/.zshrc`:

```bash
alias iracing-env='DOTENV_PRIVATE_KEY=$(security find-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w)'
```

Then just:

```bash
iracing-env pnpm test:integration
iracing-env pnpm sdk:test
```

### Rotating keys

If your private key is compromised, rotate it and update your keychain and GitHub secrets:

```bash
# Generate a new key pair and re-encrypt all values
npx @dotenvx/dotenvx rotate

# Update the keychain entry
security delete-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY"
security add-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w "$(grep '^DOTENV_PRIVATE_KEY=' .env.keys | cut -d'=' -f2)"
```

After rotating, update the `DOTENV_PRIVATE_KEY` and `DOTENV_ENV_FILE` GitHub repository secrets to match.

## Scripts

- `pnpm run build` - Check toolchain consistency and build ESM/CommonJS plus TS7 declarations with `vp pack`
- `pnpm run dev` - Rebuild the library in watch mode with `vp pack --watch`
- `pnpm run test` - Run offline unit tests with `vp test`; append `run` for a single run
- `pnpm run check` - Check formatting, lint, and types with `vp check`
- `pnpm run lint` - Run the same static checks without the formatting check
- `pnpm run format` - Format source, generator scripts, package checks, and Vite+ configs with `vp fmt`
- `pnpm run check:toolchain` - Check the coordinated Vite+/core/Vitest and compiler setup
- `pnpm run test:package` - Build, pack, and check installed ESM/CommonJS exports, browser bundling, and TS6/TS7 declarations
- `pnpm run test:package:artifacts` - Check the existing build on the current Node.js runtime without rebuilding
- `pnpm run test:dependency-policy` - Verify both projects enforce the dependency release-age policy
- `pnpm run test:env` - Verify dotenvx v1 encrypted-file compatibility and v2 encryption using synthetic credentials
- `pnpm run test:integration` - Run integration tests against the live API
- `pnpm run typecheck` - Run TypeScript 7 type checking directly
- `pnpm run sdk:generate` - Generate the client from API documentation
- `pnpm run sdk:test` - Test the client with live API calls

The package check installs the tarball into a temporary project outside the
checkout, so it requires registry access to install runtime dependencies. Its
client requests use a mock fetch and do not need iRacing credentials. The temporary
project is removed when the check finishes.

The browser check bundles the installed package and fails on unresolved imports
or Node builtin shims. It does not call the live API. `pnpm test run` excludes
credential-dependent integration tests; `pnpm test:integration` loads credentials
through dotenvx and uses the separate `vite.config.integration.mts` configuration.

To validate documentation locally, run `pnpm --dir docs-site install --frozen-lockfile`
followed by `pnpm docs:build`. PR CI runs this docs build separately from the
library checks, using the documentation project's own lockfile.

CI also runs `pnpm audit` for the library (including development dependencies)
and `pnpm --dir docs-site audit` for documentation. Resolve new findings before
merging dependency updates; narrowly scoped overrides should explain the
affected parent package and the patched version.

The dotenvx v2 compatibility check uses a public synthetic v1 fixture and a fresh
v2 encryption round trip in a temporary directory. It never loads repository
credentials or connects to the live API. The credential-dependent integration
tests remain a separate release gate.

## Dependency maintenance with Renovate

`renovate.json` manages the root and docs manifests and their independent pnpm
lockfiles, the root pnpm catalog, both package-manager pins, and GitHub Actions.
Ordinary branches are scheduled between midnight and 06:00 Europe/London, with
at most five concurrent PRs and two new PRs per hour. The schedule is a permitted
window for Renovate runs, not a promise that an update appears at midnight.

Third-party npm releases must be at least one day old and have a publication
timestamp, matching pnpm's install policy. Owned `@http-client-toolkit/*` releases
skip this delay, but their third-party dependencies still wait at installation.
Vite+ and its core alias update together at exact versions; GitHub Actions,
pnpm pins, and compatible HTTP toolkit updates have separate groups. Runtime
and docs dependencies, major upgrades, and pre-1.0 tools require manual review.
Node types stay on 24.x, the compatibility compiler stays on TS6, and the native
compiler stays on TS7.0.x. A native compiler update also requires reviewing its
explicit version check in `scripts/check-toolchain.mjs`.

Renovate does not change the consumer `engines.node` range, the Node 22/24 CI
matrix, or the Node 24 development runtime. Those remain deliberate decisions.

Automerge is disabled for every update. Before enabling it, confirm the Renovate
GitHub App has access to this repository and its Dependency Dashboard is active,
and protect `main` with required `validate (22.x)`, `validate (24.x)`, and `docs`
checks. The current candidate group is stable `tsx` patch updates only, with a
three-day release delay; change only that rule's `automerge` flag in a reviewed
follow-up after verifying the checks block a failing update. Keep runtime,
release/credential tooling, major, and pre-1.0 updates manual. The path-filtered
Renovate validation workflow should not be a required check on all PRs.

After merging the config, confirm this repo is enabled in the
[Renovate App settings](https://github.com/apps/renovate), then review its
Dependency Dashboard and first update PRs. Adding the config does not install or
grant access to the App. Keep automerge disabled until onboarding and required
status checks have been confirmed.

Security alerts may create PRs outside the overnight schedule without waiting
for Renovate's release-age check. They still require review and successful CI.
They do not bypass pnpm's strict one-day install policy: a brand-new fix can
produce an artifact/install failure until it ages. Wait and retry the update,
or explicitly review a temporary package-specific exception in the affected
`pnpm-workspace.yaml`, remove it once the fix has aged, and keep all other
packages covered. Renovate lockfile refreshes are also subject to pnpm's policy.
Do not treat an ungenerated lockfile or a failed audit as ready to merge.

Validate configuration changes with the same pinned validator used in CI:

```bash
pnpm dlx --package=renovate@44.93.4 \
  --allow-build=core-js-pure --allow-build=dtrace-provider \
  --allow-build=protobufjs --allow-build=re2 \
  renovate-config-validator --strict renovate.json
```

The explicit build allowances apply to this temporary Renovate installation;
they do not change the workspaces' build-script policies. They let pnpm 12 run
Renovate's transitive setup scripts, including its native RE2 dependency.

For read-only dependency discovery, stage the config and run:

```bash
LOG_LEVEL=debug pnpm dlx --package=renovate@44.93.4 \
  --allow-build=core-js-pure --allow-build=dtrace-provider \
  --allow-build=protobufjs --allow-build=re2 \
  renovate --platform=local --dry-run=extract
```

Inspect both pnpm lockfile associations, the two Vite+ catalog entries, and the
workflow dependencies. A local dry run does not create branches or prove App
onboarding; GitHub dependency lookups may be skipped without an App/token.
Update the validator pin deliberately when adopting new Renovate options.

## Code Generation

The client is auto-generated from iRacing's API documentation:

```bash
pnpm run sdk:generate
```

This creates:
- Individual service files in `src/[service]/service.ts`
- Type definitions in `src/[service]/types.ts`
- Main export file `src/index.ts`
- HTTP client with authentication in `src/client.ts`

Change generator templates alongside generated code. The generator formats only
the files it writes using the pinned Vite+ formatter, so a second generation must
produce no diff. Tests import from `vite-plus/test`. Linting covers both generated
and hand-written code; the few scoped exceptions in `vite.config.mts` preserve
existing query coercion, diagnostic fallbacks, and public OAuth code types.
Samples, build outputs, and the independent docs project are excluded from root
linting and formatting.
The packed consumer TypeScript fixture is formatted here but typechecked only
after installation into its temporary project, so `pnpm check` also works before
the first library build.

## CI / GitHub Actions

Publishing packs an explicit tarball with pnpm and publishes that tarball with
npm, retaining npm's trusted publishing and provenance flow when using pnpm 12.

In CI, the encrypted `.env` file is restored from a GitHub secret and decrypted by dotenvx at runtime. This means adding or changing env vars only requires updating a single secret — the workflow YAML never needs to change.

Two repository secrets are required:

- **`DOTENV_PRIVATE_KEY`** — the decryption key (retrieve from your keychain)
- **`DOTENV_ENV_FILE`** — the full content of your encrypted `.env` file

To update `DOTENV_ENV_FILE`, copy the content of your local `.env` and paste it as the secret value in GitHub Settings > Secrets > Actions.

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm run check`, `pnpm run typecheck`, `pnpm test run`, and `pnpm run test:package`; regenerate the SDK when changing templates and build the docs when changing documentation
4. Add a changeset: `npx changeset`
5. Open a Pull Request
