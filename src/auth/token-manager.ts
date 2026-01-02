import {
  TOKEN_REFRESH_BUFFER_SECONDS,
  DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
  MIN_TOKEN_REQUEST_INTERVAL_MS,
} from './constants';
import { OAuthError, TokenRefreshError } from './errors';
import { refreshTokens } from './flows/refresh';
import type { TokenState, TokenResponse, OnTokenRefresh, FetchLike } from './types';

export interface TokenManagerOptions {
  clientId: string;
  clientSecret: string;
  fetchFn: FetchLike;
  onTokenRefresh?: OnTokenRefresh;
}

/**
 * Manages OAuth token lifecycle including storage, validation, and refresh.
 *
 * Features:
 * - Automatic token refresh before expiry
 * - Concurrent refresh request deduplication
 * - Rate limiting protection
 * - Token persistence callbacks
 */
export class TokenManager {
  private tokenState: TokenState | null = null;
  private refreshPromise: Promise<TokenState> | null = null;
  private lastTokenRequest: number = 0;

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly fetchFn: FetchLike;
  private readonly onTokenRefresh?: OnTokenRefresh;

  constructor(options: TokenManagerOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.fetchFn = options.fetchFn;
    this.onTokenRefresh = options.onTokenRefresh;
  }

  /** Sets token state from a token response */
  setTokens(response: TokenResponse): void {
    const now = Math.floor(Date.now() / 1000);
    this.tokenState = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token ?? null,
      expiresAt: now + (response.expires_in || DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS),
      tokenType: response.token_type,
    };
  }

  /** Sets token state from pre-obtained tokens */
  setTokenState(state: TokenState): void {
    this.tokenState = state;
  }

  /** Returns true if we have tokens (valid or expired) */
  hasTokens(): boolean {
    return this.tokenState !== null;
  }

  /** Returns true if the current access token is valid and not expiring soon */
  isTokenValid(): boolean {
    if (!this.tokenState) return false;
    const now = Math.floor(Date.now() / 1000);
    return this.tokenState.expiresAt > now + TOKEN_REFRESH_BUFFER_SECONDS;
  }

  /** Returns true if we can refresh tokens */
  canRefresh(): boolean {
    return this.tokenState?.refreshToken !== null;
  }

  /**
   * Gets a valid access token, refreshing if necessary.
   * Handles concurrent requests and rate limiting.
   */
  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.tokenState!.accessToken;
    }

    if (!this.tokenState) {
      throw new OAuthError('invalid_grant', 'No tokens available. Please authenticate first.');
    }

    if (!this.canRefresh()) {
      throw new TokenRefreshError(
        'invalid_grant',
        'Access token expired and no refresh token available.'
      );
    }

    // Deduplicate concurrent refresh requests
    if (!this.refreshPromise) {
      this.refreshPromise = this.executeRefresh();
    }

    try {
      const newState = await this.refreshPromise;
      return newState.accessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /** Clears all stored tokens */
  clearTokens(): void {
    this.tokenState = null;
  }

  private async executeRefresh(): Promise<TokenState> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastTokenRequest;
    if (timeSinceLastRequest < MIN_TOKEN_REQUEST_INTERVAL_MS) {
      await this.sleep(MIN_TOKEN_REQUEST_INTERVAL_MS - timeSinceLastRequest);
    }
    this.lastTokenRequest = Date.now();

    try {
      const response = await refreshTokens({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.tokenState!.refreshToken!,
        fetchFn: this.fetchFn,
      });

      this.setTokens(response);

      if (this.onTokenRefresh) {
        await Promise.resolve(this.onTokenRefresh(response));
      }

      return this.tokenState!;
    } catch (error) {
      if (error instanceof OAuthError) {
        throw new TokenRefreshError(error.code, error.description, error);
      }
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
