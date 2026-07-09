# Contributing

## Getting Started

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy the example env file: `cp .env.example .env`
4. Fill in your iRacing OAuth credentials (see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials))

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
- `pnpm run test:integration` - Run integration tests against the live API
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run sdk:generate` - Generate the client from API documentation
- `pnpm run sdk:test` - Test the client with live API calls
- `pnpm run credentials:keepalive` - Make one authenticated Data API request per enabled OAuth client pair

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

In CI, the encrypted `.env` file is restored from a GitHub secret and decrypted by dotenvx at runtime. This means adding or changing env vars only requires updating a single secret — the workflow YAML never needs to change.

Two repository secrets are required:

- **`DOTENV_PRIVATE_KEY`** — the decryption key (retrieve from your keychain)
- **`DOTENV_ENV_FILE`** — the full content of your encrypted `.env` file

To update `DOTENV_ENV_FILE`, copy the content of your local `.env` and paste it as the secret value in GitHub Settings > Secrets > Actions.

### Credential keepalive

The weekly `iRacing Credential Keepalive` workflow runs `pnpm run credentials:keepalive` to prevent unused OAuth credentials from expiring.

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
3. Run `pnpm run typecheck` and `pnpm run test`
4. Add a changeset: `npx changeset`
5. Open a Pull Request
