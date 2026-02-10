/**
 * OAuth error codes returned by iRacing's OAuth server.
 */
export type OAuthErrorCode =
  | 'invalid_request'
  | 'invalid_client'
  | 'invalid_grant'
  | 'unauthorized_client'
  | 'unsupported_grant_type'
  | 'invalid_scope'
  | 'rate_limited'
  | 'server_error';

/**
 * Error thrown for OAuth-related failures.
 */
export class OAuthError extends Error {
  public override readonly name: string = 'OAuthError';

  constructor(
    public readonly code: OAuthErrorCode | string,
    public readonly description?: string,
    public readonly uri?: string
  ) {
    super(description || code);
  }

  get isInvalidGrant(): boolean {
    return this.code === 'invalid_grant';
  }

  get isInvalidClient(): boolean {
    return this.code === 'invalid_client';
  }

  get isRateLimited(): boolean {
    return this.code === 'rate_limited';
  }

  get isUnauthorizedClient(): boolean {
    return this.code === 'unauthorized_client';
  }
}

/**
 * Error thrown when token refresh fails and no recovery is possible.
 */
export class TokenRefreshError extends OAuthError {
  public override readonly name: string = 'TokenRefreshError';

  constructor(
    code: OAuthErrorCode | string,
    description?: string,
    public readonly cause?: Error
  ) {
    super(code, description);
  }
}
