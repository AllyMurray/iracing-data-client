/** ---- Generate client base class ---- */
export function generateClientBase(): string {
  return `import * as z from 'zod/mini';
import { HttpClient, type HttpClientStores } from '@http-client-toolkit/core';
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

  /**
   * Enable semantic validation for known endpoint parameter combinations.
   * @default true
   */
  validateSemanticParams?: boolean;

  /**
   * Optional stores for caching, deduplication, and rate limiting.
   * When omitted, HttpClient operates without stores (same as current behaviour).
   */
  stores?: HttpClientStores;
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
      this.responseData != null &&
      typeof this.responseData === 'object' &&
      (this.responseData as Record<string, unknown>).error === 'Site Maintenance'
    );
  }

  get isServiceUnavailable(): boolean {
    return this.status === 503 && !this.isMaintenanceMode;
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
  private readonly userFetchFn: FetchLike;
  private readonly authConfig: AuthConfig;
  private readonly tokenManager: TokenManager;
  private readonly validateParams: boolean;
  private readonly validateSemanticParams: boolean;
  private readonly httpClient: HttpClient;

  private validSeasonCarClassPairs: Set<string> | null = null;
  private validTeamSeasonCarClassPairs: Set<string> | null = null;

  private authenticationPromise: Promise<void> | null = null;

  constructor(options: IRacingClientOptions) {
    this.userFetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis);
    if (!this.userFetchFn) {
      throw new Error('No fetch available. Pass fetchFn in IRacingClientOptions.');
    }

    this.authConfig = options.auth;
    this.validateParams = options.validateParams ?? true;
    this.validateSemanticParams = options.validateSemanticParams ?? true;

    // Initialize token manager
    this.tokenManager = new TokenManager({
      clientId: options.auth.clientId,
      clientSecret: options.auth.clientSecret,
      fetchFn: this.userFetchFn,
      onTokenRefresh: options.auth.onTokenRefresh,
    });

    // Initialize with pre-obtained tokens if provided
    const tokens = options.auth.tokens;

    if (tokens) {
      this.tokenManager.setTokenState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        expiresAt:
          tokens.expiresAt ?? Math.floor(Date.now() / 1000) + DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
        tokenType: 'Bearer',
      });
    }

    // Create HttpClient with iRacing-specific hooks
    this.httpClient = new HttpClient(
      options.stores,
      {
        fetchFn: this.createFetchFn(),
        requestInterceptor: this.createRequestInterceptor(),
        responseTransformer: (data) => this.mapResponseFromApi(data),
        errorHandler: (error) => this.mapError(error),
      },
    );
  }

  /**
   * Normalizes a fetch-like response into a proper Response object.
   * This ensures compatibility with mocked fetch implementations that return
   * plain objects instead of real Response instances.
   */
  private async normalizeResponse(response: Response): Promise<Response> {
    if (response instanceof Response) {
      return response;
    }

    // Handle mock/non-standard response objects
    const mock = response as unknown as {
      ok?: boolean;
      status?: number;
      statusText?: string;
      headers?: { get?: (name: string) => string | null } | Headers;
      json?: () => Promise<unknown>;
      text?: () => Promise<string>;
    };

    let body: string;
    if (mock.json) {
      try {
        const data = await mock.json();
        body = JSON.stringify(data);
      } catch {
        body = mock.text ? await mock.text() : '';
      }
    } else if (mock.text) {
      body = await mock.text();
    } else {
      body = '';
    }

    const headers = new Headers();
    if (mock.headers) {
      if (mock.headers instanceof Headers) {
        mock.headers.forEach((value, key) => headers.set(key, value));
      } else if (typeof mock.headers.get === 'function') {
        // Try common header names
        for (const name of ['content-type', 'cache-control', 'authorization']) {
          const val = mock.headers.get(name);
          if (val) headers.set(name, val);
        }
      }
    }

    return new Response(body, {
      status: mock.status ?? (mock.ok ? 200 : 500),
      statusText: mock.statusText ?? (mock.ok ? 'OK' : 'Internal Server Error'),
      headers,
    });
  }

  /**
   * Creates the fetchFn that handles S3 link resolution and CSV responses.
   */
  private createFetchFn(): (url: string, init?: RequestInit) => Promise<Response> {
    return async (url: string, init?: RequestInit): Promise<Response> => {
      const rawResponse = await this.userFetchFn(url, init);
      const response = await this.normalizeResponse(rawResponse);

      if (!response.ok) {
        let responseData: unknown;
        try {
          responseData = await response.clone().json();
        } catch {
          // Non-JSON error response, leave responseData undefined
        }
        throw this.createHttpError(response.status, response.statusText, responseData);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return response;
      }

      // Clone to read body without consuming
      const cloned = response.clone();
      const data = await cloned.json();

      // Not an S3 link response — return original
      if (!data.link || !data.expires) {
        return response;
      }

      // Follow the S3 pre-signed URL
      const rawS3Response = await this.userFetchFn(data.link);
      const s3Response = await this.normalizeResponse(rawS3Response);

      if (!s3Response.ok) {
        throw new IRacingError(
          \`Failed to fetch from S3: \${s3Response.statusText}\`,
          s3Response.status,
          s3Response.statusText,
        );
      }

      // Calculate max-age from the S3 link's expires field
      const expiresDate = new Date(data.expires);
      const maxAge = Math.max(0, Math.floor((expiresDate.getTime() - Date.now()) / 1000));

      // Check if S3 returned CSV
      const s3ContentType = s3Response.headers.get('content-type') || '';
      if (s3ContentType.includes('text/csv') || s3ContentType.includes('text/plain')) {
        const csvText = await s3Response.text();
        const csvPayload = JSON.stringify({
          ContentType: 'csv',
          RawData: csvText,
          Note: 'This endpoint returns CSV data, not JSON',
        });

        return new Response(csvPayload, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': \`max-age=\${maxAge}\`,
          },
        });
      }

      // JSON S3 response — re-wrap with cache headers
      const s3Body = await s3Response.text();
      return new Response(s3Body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': \`max-age=\${maxAge}\`,
        },
      });
    };
  }

  /**
   * Creates the requestInterceptor that injects auth headers.
   */
  private createRequestInterceptor(): (url: string, init: RequestInit) => Promise<RequestInit> {
    return async (_url: string, init: RequestInit): Promise<RequestInit> => {
      await this.ensureAuthenticated();
      const authHeaders = await this.getAuthHeaders();

      return {
        ...init,
        headers: {
          ...Object.fromEntries(new Headers(init.headers).entries()),
          ...authHeaders,
        },
      };
    };
  }

  /**
   * Creates an IRacingError from an HTTP error response with status-specific messages.
   */
  private createHttpError(status: number, statusText: string, responseData?: unknown): IRacingError {
    if (status === 503) {
      const isMaintenance =
        responseData != null &&
        typeof responseData === 'object' &&
        (responseData as Record<string, unknown>).error === 'Site Maintenance';

      return new IRacingError(
        isMaintenance
          ? 'iRacing is currently in maintenance mode'
          : \`Service unavailable: \${statusText}\`,
        503,
        statusText,
        responseData,
      );
    }
    if (status === 429) {
      return new IRacingError(
        'Rate limit exceeded. Please wait before making more requests.',
        429,
        statusText,
        responseData,
      );
    }
    if (status === 401) {
      return new IRacingError(
        'Authentication failed. Please check your OAuth credentials and token state.',
        401,
        statusText,
        responseData,
      );
    }

    return new IRacingError(
      \`Request failed: \${statusText}\`,
      status,
      statusText,
      responseData,
    );
  }

  /**
   * Maps errors to IRacingError instances (fallback for non-HTTP errors).
   */
  private mapError(error: unknown): IRacingError {
    if (error instanceof IRacingError) {
      return error;
    }

    if (error instanceof Error) {
      return new IRacingError(error.message);
    }

    return new IRacingError(String(error));
  }

  /**
   * Ensures the client is authenticated before making API requests.
   */
  private async ensureAuthenticated(): Promise<void> {
    if (this.tokenManager.hasTokens()) {
      return;
    }

    if (isAuthorizationCodeAuth(this.authConfig)) {
      throw new OAuthError(
        'invalid_grant',
        'Authorization Code flow requires tokens. Use buildAuthorizationUrl() and ' +
          'exchangeAuthorizationCode() to obtain tokens first.'
      );
    }

    if (isPasswordLimitedAuth(this.authConfig)) {
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
      fetchFn: this.userFetchFn,
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
    return { Authorization: \`Bearer \${accessToken}\` };
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : \`\${DATA_API_BASE_URL}\${endpoint}\`
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
        const camelKey = key
          .replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase())
          .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
        mapped[camelKey] = this.mapResponseFromApi(value);
      }
      return mapped;
    }

    return data;
  }

  private pairKey(seasonId: number, carClassId: number): string {
    return \`\${seasonId}|\${carClassId}\`;
  }

  private collectSeasonCarClassPairsFromData(
    data: unknown,
    allPairs: Set<string>,
    teamPairs: Set<string>,
    inheritedSeasonId?: number,
    inheritedTeamSeries?: boolean
  ): void {
    if (data === null || data === undefined) return;

    if (Array.isArray(data)) {
      for (const item of data) {
        this.collectSeasonCarClassPairsFromData(
          item,
          allPairs,
          teamPairs,
          inheritedSeasonId,
          inheritedTeamSeries
        );
      }
      return;
    }

    if (typeof data !== 'object') return;

    const record = data as Record<string, unknown>;
    const seasonId =
      typeof record.seasonId === 'number'
        ? record.seasonId
        : typeof record.season_id === 'number'
          ? record.season_id
          : inheritedSeasonId;
    const isTeamSeries =
      inheritedTeamSeries ||
      (typeof record.maxTeamDrivers === 'number' && record.maxTeamDrivers > 1) ||
      (typeof record.max_team_drivers === 'number' && record.max_team_drivers > 1) ||
      record.driverChanges === true ||
      record.driver_changes === true;

    if (seasonId !== undefined && seasonId > 0) {
      const addPair = (value: unknown) => {
        if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return;
        const key = this.pairKey(seasonId, value);
        allPairs.add(key);
        if (isTeamSeries) {
          teamPairs.add(key);
        }
      };

      addPair(record.carClassId);
      addPair(record.car_class_id);

      const classArrays: unknown[] = [];
      if (Array.isArray(record.carClassIds)) classArrays.push(record.carClassIds);
      if (Array.isArray(record.car_class_ids)) classArrays.push(record.car_class_ids);
      if (Array.isArray(record.raceWeekCarClassIds)) classArrays.push(record.raceWeekCarClassIds);
      if (Array.isArray(record.race_week_car_class_ids)) classArrays.push(record.race_week_car_class_ids);

      for (const classArray of classArrays) {
        for (const value of classArray as unknown[]) {
          addPair(value);
        }
      }
    }

    for (const value of Object.values(record)) {
      this.collectSeasonCarClassPairsFromData(value, allPairs, teamPairs, seasonId, isTeamSeries);
    }
  }

  private async loadSeasonCarClassPairs(): Promise<void> {
    if (this.validSeasonCarClassPairs && this.validTeamSeasonCarClassPairs) {
      return;
    }

    const allPairs = new Set<string>();
    const teamPairs = new Set<string>();
    const seasons = await this.get<unknown>('https://members-ng.iracing.com/data/series/seasons');
    this.collectSeasonCarClassPairsFromData(seasons, allPairs, teamPairs);

    this.validSeasonCarClassPairs = allPairs;
    this.validTeamSeasonCarClassPairs = teamPairs;
  }

  async ensureSeasonCarClassPair(
    endpointId: string,
    seasonId: number,
    carClassId: number
  ): Promise<void> {
    if (!this.validateSemanticParams) return;
    if (!Number.isFinite(seasonId) || !Number.isFinite(carClassId)) return;

    await this.loadSeasonCarClassPairs();
    const key = this.pairKey(seasonId, carClassId);

    const preferredSet =
      endpointId === 'stats.season_team_standings' &&
      this.validTeamSeasonCarClassPairs &&
      this.validTeamSeasonCarClassPairs.size > 0
        ? this.validTeamSeasonCarClassPairs
        : this.validSeasonCarClassPairs;

    if (!preferredSet || preferredSet.has(key)) {
      return;
    }

    throw new IRacingError(
      \`Parameter validation failed for \${endpointId}: seasonId=\${seasonId} and carClassId=\${carClassId} do not form a known valid pair.\`,
      400,
      'Bad Request',
      {
        error: 'InvalidParameterCombination',
        endpoint: endpointId,
        seasonId,
        carClassId,
      }
    );
  }

  /**
   * Makes a GET request to the iRacing Data API.
   */
  async get<T = unknown>(
    url: string,
    options?: { params?: Record<string, unknown>; schema?: z.ZodMiniType<T> }
  ): Promise<T> {
    // Convert camelCase params to snake_case for the API
    const apiParams = this.mapParamsToApi(options?.params);
    const fullUrl = this.buildUrl(url, apiParams);

    // Delegate to HttpClient (handles auth, S3 resolution, caching, case mapping, errors)
    const data = await this.httpClient.get<T>(fullUrl);

    // Per-request Zod validation (not an HttpClient concern)
    if (this.validateParams && options?.schema) {
      return options.schema.parse(data);
    }

    return data;
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
`;
}
