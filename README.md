# iRacing Data Client

A TypeScript SDK for the iRacing Data API with full type safety and authentication handling.

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
import { IRacingSDK } from 'iracing-data-client';

// Initialize with credentials
const sdk = new IRacingSDK({
  email: 'your-email@example.com',
  password: 'your-password'
});

// Fetch track data
const tracks = await sdk.track.get();
console.log(tracks);

// Get member info
const member = await sdk.member.get({ custIds: [123456] });
console.log(member);
```

## Environment Variables

For testing and development, create a `.env` file:

```env
EMAIL=your-iracing-email@example.com
PASSWORD=your-iracing-password
```

## Available Services

The SDK is organized into the following services:

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

The SDK includes proper error handling for common iRacing API scenarios:

```typescript
import { IRacingSDK, IRacingError } from 'iracing-data-client';

try {
  const data = await sdk.member.get({ custIds: [123] });
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
const sdk = new IRacingSDK({
  email: 'your-email@example.com',        // iRacing account email
  password: 'your-password',              // iRacing account password
  headers: { 'User-Agent': 'MyApp/1.0' }, // Custom headers (optional)
  fetchFn: customFetch,                   // Custom fetch function (optional)
  validateParams: true                    // Enable parameter validation (optional)
});
```

## Development

### Scripts

- `npm run sdk:generate` - Generate SDK from API documentation
- `npm run sdk:test` - Test the SDK with live API calls
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run unit tests

### Generating the SDK

The SDK is auto-generated from iRacing's API documentation:

```bash
npm run sdk:generate
```

This creates:
- Individual service files in `src/[service]/service.ts`
- Type definitions in `src/[service]/types.ts`  
- Main export file `src/index.ts`
- HTTP client with authentication in `src/client.ts`

### Testing

Test the SDK against the live iRacing API:

```bash
npm run sdk:test
```

Make sure your credentials are in the `.env` file.

## API Reference

### Authentication

The SDK handles iRacing's cookie-based authentication automatically. On first request, it will:

1. Log in with your credentials
2. Store authentication cookies
3. Follow S3 redirect links to fetch actual data
4. Handle CSV responses where applicable

### Response Types

All endpoints return fully typed responses. For example:

```typescript
// Member service
const members = await sdk.member.get({ custIds: [123456] });
// members is typed as MemberGetResponse[]

// Track service  
const tracks = await sdk.track.get();
// tracks is typed as TrackGetResponse (TrackGetItem[])
```

### Parameter Validation

When `validateParams: true` is set, the SDK validates all parameters using Zod schemas:

```typescript
const sdk = new IRacingSDK({ 
  email: 'test@example.com',
  password: 'password',
  validateParams: true 
});

// This will throw if seasonId is not a number
await sdk.season.list({ seasonId: 'invalid' }); // ❌ Validation error
await sdk.season.list({ seasonId: 12345 });     // ✅ Valid
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

This is an unofficial SDK for the iRacing Data API. iRacing is a trademark of iRacing.com Motorsport Simulations, LLC.