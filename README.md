# iRacing Data Client

A TypeScript client for the iRacing Data API with full type safety and automatic OAuth2 authentication.

> **ℹ️ Authentication has been migrated to the new iRacing OAuth2 system.** The legacy email/password authentication has been replaced with OAuth2 client credentials. See the [Authentication guide](https://allymurray.github.io/iracing-data-client/getting-started/authentication/) for details.

- 🏎️ Complete coverage of the iRacing Data API (72+ endpoints)
- 🔒 OAuth2 authentication with automatic token refresh
- 📝 Full TypeScript support with generated types
- 🔄 Automatic camelCase conversion for JavaScript conventions
- 🎯 Runtime parameter validation using Zod schemas
- ⚡ Opt-in response caching, request deduplication, and rate limiting via pluggable stores
- 🔁 Opt-in retry preset with exponential backoff for transient failures
- 🛡️ Maintenance mode and rate limit detection

**[Documentation](https://allymurray.github.io/iracing-data-client)**

## Installation

```bash
npm install iracing-data-client
# or
pnpm add iracing-data-client
# or
yarn add iracing-data-client
```

## Quick Start

You'll need OAuth credentials from iRacing — see [OAuth Client Credentials](https://support.iracing.com/support/solutions/articles/31000177790-oauth-client-credentials) to register.

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

const tracks = await dataClient.track.get();
const member = await dataClient.member.get({ custIds: [123456] });
```

## Services

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

See the [API reference](https://allymurray.github.io/iracing-data-client/api/services) for full details.

## Error Handling

```typescript
import { IRacingDataClient, IRacingError } from 'iracing-data-client';

try {
  const data = await dataClient.member.get({ custIds: [123] });
} catch (error) {
  if (error instanceof IRacingError) {
    if (error.isMaintenanceMode) {
      console.log('iRacing is in maintenance mode');
      return;
    }

    console.log(`API Error: ${error.message}`);
    console.log(`Status: ${error.status}`);
  }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, including how to configure secrets with dotenvx and run integration tests.

## License

ISC License - see LICENSE file for details.

## Disclaimer

This is an unofficial client for the iRacing Data API. iRacing is a trademark of iRacing.com Motorsport Simulations, LLC.
