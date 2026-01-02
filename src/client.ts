import * as z from 'zod/mini';
import {
  type AuthConfig,
  type FetchLike,
  isPasswordLimitedAuth,
  isAuthorizationCodeAuth,
  TokenManager,
  requestPasswordLimitedToken,
  OAuthError,
  DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
  DATA_API_BASE_URL,
} from './auth';

/**
 * Configuration options for the iRacing Data Client.
 */
export interface IRacingClientOptions {
  /**
   * Authentication configuration.
   * Choose between Password Limited (for scripts) or Authorization Code (for web apps).
   */
  auth: AuthConfig;

  /**
   * Custom fetch implementation.
   * Useful for testing or environments without global fetch.
   * @default globalThis.fetch
   */
  fetchFn?: FetchLike;

  /**
   * Enable runtime validation of request parameters against Zod schemas.
   * @default true
   */
  validateParams?: boolean;
}

/**
 * Error thrown for iRacing API-level errors.
 */
export class IRacingError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
    public readonly responseData?: unknown
  ) {
    super(message);
    this.name = 'IRacingError';
  }

  get isMaintenanceMode(): boolean {
    return (
      this.status === 503 &&
      (this.responseData as Record<string, unknown>)?.error === 'Site Maintenance'
    );
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

/**
 * iRacing Data API Client with OAuth2 authentication.
 */
export class IRacingClient {
  private readonly fetchFn: FetchLike;
  private readonly authConfig: AuthConfig;
  private readonly tokenManager: TokenManager;
  private readonly validateParams: boolean;

  private authenticationPromise: Promise<void> | null = null;

  constructor(options: IRacingClientOptions) {
    this.fetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis);
    if (!this.fetchFn) {
      throw new Error('No fetch available. Pass fetchFn in IRacingClientOptions.');
    }

    this.authConfig = options.auth;
    this.validateParams = options.validateParams ?? true;

    // Initialize token manager
    this.tokenManager = new TokenManager({
      clientId: options.auth.clientId,
      clientSecret: options.auth.clientSecret,
      fetchFn: this.fetchFn,
      onTokenRefresh: options.auth.onTokenRefresh,
    });

    // Initialize with pre-obtained tokens if provided
    const tokens = isPasswordLimitedAuth(options.auth) ? options.auth.tokens : options.auth.tokens;

    if (tokens) {
      this.tokenManager.setTokenState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        expiresAt:
          tokens.expiresAt ?? Math.floor(Date.now() / 1000) + DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
        tokenType: 'Bearer',
      });
    }
  }

  /**
   * Ensures the client is authenticated before making API requests.
   */
  private async ensureAuthenticated(): Promise<void> {
    // Already have tokens
    if (this.tokenManager.hasTokens()) {
      return;
    }

    // Authorization Code flow requires pre-obtained tokens
    if (isAuthorizationCodeAuth(this.authConfig)) {
      throw new OAuthError(
        'invalid_grant',
        'Authorization Code flow requires tokens. Use buildAuthorizationUrl() and ' +
          'exchangeAuthorizationCode() to obtain tokens first.'
      );
    }

    // Password Limited flow - authenticate
    if (isPasswordLimitedAuth(this.authConfig)) {
      // Prevent concurrent authentication
      if (!this.authenticationPromise) {
        this.authenticationPromise = this.authenticatePasswordLimited();
      }

      try {
        await this.authenticationPromise;
      } finally {
        this.authenticationPromise = null;
      }
    }
  }

  private async authenticatePasswordLimited(): Promise<void> {
    if (!isPasswordLimitedAuth(this.authConfig)) {
      throw new Error('Invalid auth config');
    }

    const tokens = await requestPasswordLimitedToken({
      clientId: this.authConfig.clientId,
      clientSecret: this.authConfig.clientSecret,
      username: this.authConfig.username,
      password: this.authConfig.password,
      fetchFn: this.fetchFn,
    });

    this.tokenManager.setTokens(tokens);

    if (this.authConfig.onTokenRefresh) {
      await Promise.resolve(this.authConfig.onTokenRefresh(tokens));
    }
  }

  /**
   * Gets authorization headers for API requests.
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.tokenManager.getAccessToken();
    return { Authorization: `Bearer ${accessToken}` };
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${DATA_API_BASE_URL}${endpoint}`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(','));
          } else if (typeof value === 'boolean') {
            url.searchParams.append(key, value ? 'true' : 'false');
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  private mapParamsToApi(params?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }

  private mapResponseFromApi(data: unknown): unknown {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.mapResponseFromApi(item));
    }

    if (typeof data === 'object') {
      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        // Convert snake_case and kebab-case to camelCase
        const camelKey = key
          .replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase())
          .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
        mapped[camelKey] = this.mapResponseFromApi(value);
      }
      return mapped;
    }

    return data;
  }

  /**
   * Makes a GET request to the iRacing Data API.
   */
  async get<T = unknown>(
    url: string,
    options?: { params?: Record<string, unknown>; schema?: z.ZodMiniType<T> }
  ): Promise<T> {
    await this.ensureAuthenticated();

    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(options?.params);

    const headers = await this.getAuthHeaders();

    const response = await this.fetchFn(this.buildUrl(url, apiParams), {
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let responseData: unknown = null;

      // Try to parse JSON error response
      try {
        responseData = JSON.parse(text);
      } catch {
        // Not JSON, use raw text
      }

      // Handle maintenance mode specifically
      if (
        response.status === 503 &&
        (responseData as Record<string, unknown>)?.error === 'Site Maintenance'
      ) {
        throw new IRacingError(
          `iRacing is currently in maintenance mode: ${(responseData as Record<string, unknown>)?.message || 'Service temporarily unavailable'}`,
          response.status,
          response.statusText,
          responseData
        );
      }

      // Handle other specific errors
      if (response.status === 429) {
        throw new IRacingError(
          'Rate limit exceeded. Please wait before making more requests.',
          response.status,
          response.statusText,
          responseData
        );
      }

      if (response.status === 401) {
        throw new IRacingError(
          'Authentication failed. Please check your credentials.',
          response.status,
          response.statusText,
          responseData
        );
      }

      // Generic error
      const errorMessage =
        (responseData as Record<string, unknown>)?.message ||
        (responseData as Record<string, unknown>)?.error ||
        text ||
        response.statusText;
      throw new IRacingError(
        `Request failed: ${errorMessage}`,
        response.status,
        response.statusText,
        responseData
      );
    }

    const contentType = response.headers.get('content-type') || '';

    // Check if this is a direct JSON response (some endpoints don't use S3)
    if (contentType.includes('application/json')) {
      const data = await response.json();

      // Check if it's an S3 link response
      if (data.link && data.expires) {
        // Fetch the actual data from S3
        const s3Response = await this.fetchFn(data.link);
        if (!s3Response.ok) {
          throw new IRacingError(
            `Failed to fetch from S3: ${s3Response.statusText}`,
            s3Response.status,
            s3Response.statusText
          );
        }

        // Check content type of S3 response
        const s3ContentType = s3Response.headers.get('content-type') || '';
        if (s3ContentType.includes('text/csv') || s3ContentType.includes('text/plain')) {
          // Return CSV as raw text wrapped in an object
          const csvText = await s3Response.text();
          return {
            ContentType: 'csv',
            RawData: csvText,
            Note: 'This endpoint returns CSV data, not JSON',
          } as T;
        }

        const s3Data = await s3Response.json();
        const mappedData = this.mapResponseFromApi(s3Data);

        if (options?.schema) {
          return options.schema.parse(mappedData);
        }

        return mappedData as T;
      }

      const mappedData = this.mapResponseFromApi(data);

      if (options?.schema) {
        return options.schema.parse(mappedData);
      }

      return mappedData as T;
    }

    throw new IRacingError(`Unexpected content type: ${contentType}`);
  }

  /**
   * Returns true if the client has valid tokens.
   */
  isAuthenticated(): boolean {
    return this.tokenManager.hasTokens() && this.tokenManager.isTokenValid();
  }

  /**
   * Clears stored tokens, requiring re-authentication on next request.
   */
  clearTokens(): void {
    this.tokenManager.clearTokens();
  }
}
