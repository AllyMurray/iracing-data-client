export const OAUTH_ENDPOINTS = {
  authorize: 'https://oauth.iracing.com/oauth2/authorize',
  token: 'https://oauth.iracing.com/oauth2/token',
} as const;

/** Required scope for iRacing Data API access */
export const IRACING_AUTH_SCOPE = 'iracing.auth';

export const DATA_API_BASE_URL = 'https://members-ng.iracing.com';

/** Buffer time (seconds) before token expiry to trigger refresh */
export const TOKEN_REFRESH_BUFFER_SECONDS = 30;

/** Default access token lifetime (10 minutes) */
export const DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS = 600;

/** Minimum interval between token requests to avoid rate limiting */
export const MIN_TOKEN_REQUEST_INTERVAL_MS = 1000;
