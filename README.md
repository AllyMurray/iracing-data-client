# iRacing Data Client

A TypeScript Data Client for the iRacing Data API with full type safety and authentication handling.

## Features

- 🏎️ Complete coverage of iRacing Data API (72+ endpoints)
- 🔒 Built-in authentication with cookie management
- 📝 Full TypeScript support with generated types
- 🎯 Tree-shakeable imports using Zod schemas
- 🚀 Modular architecture with service-based organization
- 🛡️ Proper error handling with maintenance mode detection
- 🔄 Automatic camelCase conversion for JavaScript conventions

## Installation

```bash
npm install iracing-data-client
# or
pnpm add iracing-data-client
# or
yarn add iracing-data-client
```

## Quick Start

```typescript
import { IRacingDataClient } from 'iracing-data-client';

const dataClient = new IRacingDataClient({
  auth: {
    type: 'password-limited',
    clientId: process.env.IRACING_CLIENT_ID,
    clientSecret: process.env.IRACING_CLIENT_SECRET,
    username: process.env.IRACING_USERNAME,
    password: process.env.IRACING_PASSWORD,
  },
});

// Fetch track data
const tracks = await dataClient.track.get();
console.log(tracks);

// Get member info
const member = await dataClient.member.get({ custIds: [123456] });
console.log(member);
```

## Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

You'll need OAuth credentials from iRacing — see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials) to register.

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

### CI / GitHub Actions

In CI, the encrypted `.env` file is restored from a GitHub secret and decrypted by dotenvx at runtime. This means adding or changing env vars only requires updating a single secret — the workflow YAML never needs to change.

Two repository secrets are required:

- **`DOTENV_PRIVATE_KEY`** — the decryption key (retrieve from your keychain)
- **`DOTENV_ENV_FILE`** — the full content of your encrypted `.env` file

To update `DOTENV_ENV_FILE`, copy the content of your local `.env` and paste it as the secret value in GitHub Settings > Secrets > Actions.

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

## Available Services

The Data Client is organized into the following services:

- **car** - Car assets and information
- **carclass** - Car class data
- **constants** - Categories, divisions, event types
- **driverStatsByCategory** - Driver statistics by category
- **hosted** - Hosted session data
- **league** - League information and standings
- **lookup** - Countries, drivers, licenses, etc.
- **member** - Member profiles, awards, participation
- **results** - Race results and lap data  
- **season** - Season information and race guides
- **series** - Series data and statistics
- **stats** - Member statistics and world records
- **team** - Team membership data
- **timeAttack** - Time attack season results
- **track** - Track assets and configuration

## Error Handling

The Data Client includes proper error handling for common iRacing API scenarios:

```typescript
import { IRacingDataClient, IRacingError } from 'iracing-data-client';

try {
  const data = await dataClient.member.get({ custIds: [123] });
} catch (error) {
  if (error instanceof IRacingError) {
    if (error.isMaintenanceMode) {
      console.log('iRacing is in maintenance mode');
      // Handle gracefully
      return;
    }
    
    console.log(`API Error: ${error.message}`);
    console.log(`Status: ${error.status}`);
  }
}
```

## Configuration Options

```typescript
const dataClient = new IRacingDataClient({
  auth: {
    type: 'password-limited',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    username: 'your-email@example.com',
    password: 'your-password',
  },
});
```

## Development

### Scripts

- `pnpm run sdk:generate` - Generate Data Client from API documentation
- `pnpm run sdk:test` - Test the Data Client with live API calls
- `pnpm run test` - Run unit tests
- `pnpm run test:integration` - Run integration tests against the live API
- `pnpm run typecheck` - Run TypeScript type checking

### Testing

Scripts that need credentials use dotenvx automatically. Set `DOTENV_PRIVATE_KEY` and run:

```bash
DOTENV_PRIVATE_KEY=$(security find-generic-password -a "iracing-data-client" -s "DOTENV_PRIVATE_KEY" -w) pnpm test:integration
```

### Generating the Data Client

The Data Client is auto-generated from iRacing's API documentation:

```bash
pnpm run sdk:generate
```

This creates:
- Individual service files in `src/[service]/service.ts`
- Type definitions in `src/[service]/types.ts`
- Main export file `src/index.ts`
- HTTP client with authentication in `src/client.ts`

## API Reference

### Authentication

The Data Client handles iRacing's OAuth2 authentication automatically. On first request, it will:

1. Authenticate using the Password Limited OAuth flow
2. Manage access and refresh tokens
3. Follow S3 redirect links to fetch actual data
4. Handle CSV responses where applicable

### Response Types

All endpoints return fully typed responses. For example:

```typescript
// Member service
const members = await dataClient.member.get({ custIds: [123456] });
// members is typed as MemberGetResponse[]

// Track service  
const tracks = await dataClient.track.get();
// tracks is typed as TrackGetResponse (TrackGetItem[])
```

### Parameter Validation

All parameters are validated at runtime using Zod schemas:

```typescript
// This will throw if seasonId is not a number
await dataClient.season.list({ seasonId: 'invalid' }); // Validation error
await dataClient.season.list({ seasonId: 12345 });     // Valid
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run type checking (`npm run typecheck`)
5. Test with the live API (`npm run sdk:test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

ISC License - see LICENSE file for details.

## Disclaimer

This is an unofficial Data Client for the iRacing Data API. iRacing is a trademark of iRacing.com Motorsport Simulations, LLC.