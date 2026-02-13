# iracing-data-client

## 0.2.0

### Minor Changes

- d787efa: Refactor IRacingError to accept an options object and expose `url` and `headers` from HTTP error responses. Add `IRacingErrorOptions` export.

## 0.1.1

### Patch Changes

- 2b73ecc: Update documentation site with complete API references for all service pages and add npm homepage link

## 0.1.0

### Minor Changes

- a829c48: Add OAuth2 authentication with Password Limited and Authorization Code flows, replacing legacy cookie-based auth. Includes token management with automatic refresh, PKCE support, and SHA-256 credential masking per iRacing's spec. Replace dotenv with dotenvx for encrypted secrets management. Update all scripts, tests, and documentation to use consistent IRACING\_\* environment variable names and the new OAuth auth config.
