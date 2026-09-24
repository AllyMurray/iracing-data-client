# iracing-data-client

## 0.5.2

### Patch Changes

- 4ab4a41: Mark the package as free of import-time side effects so bundlers can remove unused imports, and pin the HTTP toolkit runtime dependency to the reviewed 4.2.0 release. Preserve support for every Node.js version from 22 onward.

## 0.5.1

### Patch Changes

- 8ea27c6: Build the published ESM and CommonJS packages with Vite+ and TypeScript 7.
  Preserve existing exports, runtime dependencies, and browser syntax compatibility,
  with packed-package validation against TypeScript 6 and 7 consumers.

## 0.5.0

### Minor Changes

- d0adb21: Support Node.js 22 and newer and remove support for older Node releases.
  Consumers on Node.js 18 or 20 must upgrade to Node.js 22 or newer. Modern browser
  support is unchanged. Repository development, builds, documentation, and releases
  now use Node.js 24 and pnpm 12, with package compatibility checked in CI on
  Node.js 22 and 24 LTS.

### Patch Changes

- 1c23461: Widen the published Node.js engine range to `>=22.0.0`, including odd-numbered
  releases such as Node.js 23 and 25. CI continues to test Node.js 22 and 24 LTS;
  repository development, builds, documentation, and releases continue to use
  Node.js 24.
- b3ce16e: Update Zod to 4.6.5 and verify the generated schemas and published TypeScript
  declarations against the updated runtime dependency.

## 0.4.0

### Minor Changes

- fa4c718: Upgrade `@http-client-toolkit/core` to v4.2 and expose opt-in retry/backoff, rate-limit wait configuration, observability events, and pending request counts on the iRacing client. Adds `DEFAULT_RETRY_OPTIONS` as the recommended retry preset for transient iRacing API failures.

## 0.3.0

### Minor Changes

- 722b069: Remove generated endpoint parameter schema exports from the public TypeScript surface.

  This is a breaking change for TypeScript projects that imported generated `*ParamsSchema` values from service `types` modules. Runtime request parameter validation now uses private service-local validators instead, while exported endpoint parameter types remain available.

  Optional-only parameter objects can now be omitted when calling service methods, `validateParams` now validates request parameters before making network requests, and the docs have been updated to reflect implemented opt-in caching/rate-limit stores.

## 0.2.3

### Patch Changes

- 1c19a29: Improve generated iRacing Data API response types with richer sample merging and dictionary schema inference.

## 0.2.2

### Patch Changes

- 8432c0e: Fix schema generator dictionary detection when merging multiple sample variations. Internal markers were breaking the numeric-key heuristic, causing dictionary schemas like `CarAssets` to generate as `z.unknown()` instead of typed schemas.

## 0.2.1

### Patch Changes

- d91a8fd: Improve npm discoverability by fixing duplicate keyword and adding additional search keywords.

## 0.2.0

### Minor Changes

- d787efa: Refactor IRacingError to accept an options object and expose `url` and `headers` from HTTP error responses. Add `IRacingErrorOptions` export.

## 0.1.1

### Patch Changes

- 2b73ecc: Update documentation site with complete API references for all service pages and add npm homepage link

## 0.1.0

### Minor Changes

- a829c48: Add OAuth2 authentication with Password Limited and Authorization Code flows, replacing legacy cookie-based auth. Includes token management with automatic refresh, PKCE support, and SHA-256 credential masking per iRacing's spec. Replace dotenv with dotenvx for encrypted secrets management. Update all scripts, tests, and documentation to use consistent IRACING\_\* environment variable names and the new OAuth auth config.
