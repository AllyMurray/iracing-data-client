import * as z from 'zod/mini';

/**
 * Fetch-like function type for HTTP requests.
 * Allows injection of custom fetch implementations for testing.
 */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Zod schema for validating OAuth token responses.
 * Provides runtime validation of iRacing's token endpoint responses.
 */
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
  refresh_token: z.optional(z.string()),
  refresh_token_expires_in: z.optional(z.number()),
  scope: z.optional(z.string()),
});

/**
 * OAuth token response from iRacing's token endpoint.
 */
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

/**
 * Internal token state with computed expiry.
 */
export interface TokenState {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number; // Unix timestamp in seconds
  tokenType: 'Bearer';
}

/**
 * Callback invoked when tokens are obtained or refreshed.
 * Use this to persist tokens for reuse across sessions.
 */
export type OnTokenRefresh = (tokens: TokenResponse) => void | Promise<void>;

/**
 * PKCE code challenge and verifier pair.
 */
export interface PKCEPair {
  verifier: string;
  challenge: string;
}

/**
 * Password Limited OAuth flow configuration.
 *
 * Use for scripts, CLI tools, and backend services running on behalf of
 * the registered client developer only. This is the most common flow for
 * automated data access.
 *
 * @example
 * ```typescript
 * const client = new IRacingDataClient({
 *   auth: {
 *     type: 'password-limited',
 *     clientId: process.env.IRACING_CLIENT_ID,
 *     clientSecret: process.env.IRACING_CLIENT_SECRET,
 *     username: process.env.IRACING_USERNAME,
 *     password: process.env.IRACING_PASSWORD,
 *   },
 * });
 * ```
 */
export interface PasswordLimitedAuth {
  type: 'password-limited';

  /** OAuth client ID issued by iRacing */
  clientId: string;

  /** OAuth client secret issued by iRacing */
  clientSecret: string;

  /** iRacing account email (must match registered client owner) */
  username: string;

  /** iRacing account password */
  password: string;

  /**
   * Pre-obtained tokens to skip initial authentication.
   * Useful for reusing tokens across client instances.
   */
  tokens?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  /**
   * Called when tokens are obtained or refreshed.
   * Use to persist tokens for reuse across sessions.
   */
  onTokenRefresh?: OnTokenRefresh;
}

/**
 * Authorization Code OAuth flow configuration.
 *
 * Use for web/desktop applications that need to access iRacing data
 * on behalf of other users. Requires completing the OAuth flow externally
 * before creating the client.
 *
 * @example
 * ```typescript
 * // After completing OAuth flow and obtaining tokens:
 * const client = new IRacingDataClient({
 *   auth: {
 *     type: 'authorization-code',
 *     clientId: process.env.IRACING_CLIENT_ID,
 *     clientSecret: process.env.IRACING_CLIENT_SECRET,
 *     tokens: {
 *       accessToken: savedTokens.access_token,
 *       refreshToken: savedTokens.refresh_token,
 *       expiresAt: savedTokens.expires_at,
 *     },
 *   },
 * });
 * ```
 */
export interface AuthorizationCodeAuth {
  type: 'authorization-code';

  /** OAuth client ID issued by iRacing */
  clientId: string;

  /** OAuth client secret issued by iRacing */
  clientSecret: string;

  /**
   * Tokens obtained from completing the Authorization Code flow.
   * Required since this flow requires user interaction.
   */
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };

  /**
   * Called when tokens are refreshed.
   * Use to persist new tokens for the user's session.
   */
  onTokenRefresh?: OnTokenRefresh;
}

/**
 * Discriminated union of supported authentication strategies.
 */
export type AuthConfig = PasswordLimitedAuth | AuthorizationCodeAuth;

/**
 * Type guard for Password Limited authentication.
 */
export function isPasswordLimitedAuth(auth: AuthConfig): auth is PasswordLimitedAuth {
  return auth.type === 'password-limited';
}

/**
 * Type guard for Authorization Code authentication.
 */
export function isAuthorizationCodeAuth(auth: AuthConfig): auth is AuthorizationCodeAuth {
  return auth.type === 'authorization-code';
}
