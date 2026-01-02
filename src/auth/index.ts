// Type exports
export type {
  AuthConfig,
  PasswordLimitedAuth,
  AuthorizationCodeAuth,
  TokenResponse,
  TokenState,
  OnTokenRefresh,
  PKCEPair,
  FetchLike,
} from './types';

export { TokenResponseSchema, isPasswordLimitedAuth, isAuthorizationCodeAuth } from './types';

// Error exports
export { OAuthError, TokenRefreshError, type OAuthErrorCode } from './errors';

// Constants exports
export {
  OAUTH_ENDPOINTS,
  IRACING_AUTH_SCOPE,
  DATA_API_BASE_URL,
  TOKEN_REFRESH_BUFFER_SECONDS,
  DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
} from './constants';

// Crypto exports
export { maskSecret, maskPassword, maskClientSecret, generatePKCE } from './crypto';

// Flow exports
export { requestPasswordLimitedToken } from './flows/password-limited';
export { buildAuthorizationUrl, exchangeAuthorizationCode } from './flows/authorization-code';
export { refreshTokens } from './flows/refresh';

// Token manager export
export { TokenManager, type TokenManagerOptions } from './token-manager';
