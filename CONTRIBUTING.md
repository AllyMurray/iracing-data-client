# Contributing

## Getting Started

1. Fork and clone the repository
2. Use Node.js 24 (`nvm use` reads `.nvmrc`) and pnpm 12.4.2, then install dependencies: `pnpm install --frozen-lockfile`
3. Copy the example env file: `cp .env.example .env`
4. Fill in your iRacing OAuth credentials (see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials))

Both `package.json` files pin the same pnpm version. The library and `docs-site`
remain separate pnpm projects with independent lockfiles. Install docs dependencies
with `pnpm --dir docs-site install --frozen-lockfile`.

Library consumers are supported on Node.js 22 and 24. CI installs dependencies,
generates code, typechecks, and builds on Node.js 24 before switching to each
consumer runtime for unit tests and installed-package checks. Docs and releases
also use Node.js 24. The consumer support range in `engines.node` is a deliberate
compatibility policy, separate from the development runtime.

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

- `pnpm run build` - Build the library
- `pnpm run test` - Run unit tests
- `pnpm run test:package` - Build, pack, and check the installed package's ESM/CommonJS exports and TypeScript declarations
- `pnpm run test:package:artifacts` - Check the existing build on the current Node.js runtime without rebuilding
- `pnpm run test:dependency-policy` - Verify both projects enforce the dependency release-age policy
- `pnpm run test:integration` - Run integration tests against the live API
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run sdk:generate` - Generate the client from API documentation
- `pnpm run sdk:test` - Test the client with live API calls

The package check installs the tarball into a temporary project outside the
checkout, so it requires registry access to install runtime dependencies. Its
client requests use a mock fetch and do not need iRacing credentials. The temporary
project is removed when the check finishes.

To validate documentation locally, run `pnpm --dir docs-site install --frozen-lockfile`
followed by `pnpm docs:build`. PR CI runs this docs build separately from the
library checks, using the documentation project's own lockfile.

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
3. Run `pnpm run typecheck`, `pnpm test run`, and `pnpm run test:package`; build the docs when changing documentation
4. Add a changeset: `npx changeset`
5. Open a Pull Request
