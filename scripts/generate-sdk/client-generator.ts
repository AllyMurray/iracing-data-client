/** ---- Generate client base class ---- */
export function generateClientBase(): string {
  return `import * as z from "zod/mini";
import { requestPasswordLimitedToken } from "./auth/flows/password-limited";
import { TokenManager } from "./auth/token-manager";
import { isPasswordLimitedAuth, type AuthConfig, type FetchLike } from "./auth/types";

export interface IRacingClientOptions {
  auth: AuthConfig;
  fetchFn?: FetchLike;
  validateParams?: boolean;
  validateSemanticParams?: boolean;
}

export class IRacingError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
    public readonly responseData?: any
  ) {
    super(message);
    this.name = 'IRacingError';
  }

  get isMaintenanceMode(): boolean {
    return this.status === 503 && this.responseData?.error === 'Site Maintenance';
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export class IRacingClient {
  private baseUrl = 'https://members-ng.iracing.com';
  private fetchFn: FetchLike;
  private auth: AuthConfig;
  private validateParams: boolean;
  private validateSemanticParams: boolean;
  private tokenManager: TokenManager;
  private validSeasonCarClassPairs: Set<string> | null = null;
  private validTeamSeasonCarClassPairs: Set<string> | null = null;

  constructor(opts: IRacingClientOptions) {
    if (!opts || !opts.auth) {
      throw new Error('auth configuration is required');
    }

    this.fetchFn = opts.fetchFn ?? globalThis.fetch;
    if (!this.fetchFn) throw new Error('No fetch available. Pass fetchFn in IRacingClientOptions.');

    this.auth = opts.auth;
    this.validateParams = opts.validateParams ?? true;
    this.validateSemanticParams = opts.validateSemanticParams ?? true;

    this.tokenManager = new TokenManager({
      clientId: this.auth.clientId,
      clientSecret: this.auth.clientSecret,
      fetchFn: this.fetchFn,
      onTokenRefresh: this.auth.onTokenRefresh,
    });

    if (this.auth.tokens) {
      this.tokenManager.setTokenState({
        accessToken: this.auth.tokens.accessToken,
        refreshToken: this.auth.tokens.refreshToken ?? null,
        expiresAt: this.auth.tokens.expiresAt ?? Math.floor(Date.now() / 1000) + 600,
        tokenType: 'Bearer',
      });
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith('http') ? endpoint : \`\${this.baseUrl}\${endpoint}\`);

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

  private async ensureAccessToken(): Promise<string> {
    if (!this.tokenManager.hasTokens()) {
      if (!isPasswordLimitedAuth(this.auth)) {
        throw new Error('No OAuth tokens available. Provide auth.tokens or use password-limited auth.');
      }

      const tokenResponse = await requestPasswordLimitedToken({
        clientId: this.auth.clientId,
        clientSecret: this.auth.clientSecret,
        username: this.auth.username,
        password: this.auth.password,
        fetchFn: this.fetchFn,
      });

      this.tokenManager.setTokens(tokenResponse);

      if (this.auth.onTokenRefresh) {
        await Promise.resolve(this.auth.onTokenRefresh(tokenResponse));
      }
    }

    return this.tokenManager.getAccessToken();
  }

  private mapParamsToApi(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      const snakeKey = key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }

  private mapResponseFromApi(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.mapResponseFromApi(item));
    }

    if (typeof data === 'object') {
      const mapped: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
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
    return seasonId + '|' + carClassId;
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
        this.collectSeasonCarClassPairsFromData(item, allPairs, teamPairs, inheritedSeasonId, inheritedTeamSeries);
      }
      return;
    }

    if (typeof data !== 'object') return;

    const record = data as Record<string, unknown>;
    const seasonId = typeof record.seasonId === 'number'
      ? record.seasonId
      : typeof record.season_id === 'number'
      ? record.season_id
      : inheritedSeasonId;
    const isTeamSeries = inheritedTeamSeries ||
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

  async ensureSeasonCarClassPair(endpointId: string, seasonId: number, carClassId: number): Promise<void> {
    if (!this.validateSemanticParams) return;
    if (!Number.isFinite(seasonId) || !Number.isFinite(carClassId)) return;

    await this.loadSeasonCarClassPairs();
    const key = this.pairKey(seasonId, carClassId);

    const preferredSet = endpointId === 'stats.season_team_standings' && this.validTeamSeasonCarClassPairs && this.validTeamSeasonCarClassPairs.size > 0
      ? this.validTeamSeasonCarClassPairs
      : this.validSeasonCarClassPairs;

    if (!preferredSet || preferredSet.has(key)) {
      return;
    }

    throw new IRacingError(
      'Parameter validation failed for ' + endpointId + ': seasonId=' + seasonId + ' and carClassId=' + carClassId + ' do not form a known valid pair.',
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

  async get<T = unknown>(url: string, options?: { params?: Record<string, any>; schema?: z.ZodMiniType<T> }): Promise<T> {
    const accessToken = await this.ensureAccessToken();
    const apiParams = this.mapParamsToApi(options?.params);

    const response = await this.fetchFn(this.buildUrl(url, apiParams), {
      headers: {
        Authorization: \`Bearer \${accessToken}\`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let responseData: any = null;

      try {
        responseData = JSON.parse(text);
      } catch {
        // Keep text-only response
      }

      if (response.status === 503 && responseData?.error === 'Site Maintenance') {
        throw new IRacingError(
          \`iRacing is currently in maintenance mode: \${responseData.message || 'Service temporarily unavailable'}\`,
          response.status,
          response.statusText,
          responseData
        );
      }

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
          'Authentication failed. Please check your OAuth credentials and token state.',
          response.status,
          response.statusText,
          responseData
        );
      }

      const errorMessage = responseData?.message || responseData?.error || text || response.statusText;
      throw new IRacingError(
        \`Request failed: \${errorMessage}\`,
        response.status,
        response.statusText,
        responseData
      );
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();

      if ((data as any).link && (data as any).expires) {
        const s3Response = await this.fetchFn((data as any).link);
        if (!s3Response.ok) {
          throw new Error(\`Failed to fetch from S3: \${s3Response.statusText}\`);
        }

        const s3ContentType = s3Response.headers.get('content-type') || '';
        if (s3ContentType.includes('text/csv') || s3ContentType.includes('text/plain')) {
          const csvText = await s3Response.text();
          return {
            ContentType: 'csv',
            RawData: csvText,
            Note: 'This endpoint returns CSV data, not JSON',
          } as T;
        }

        const s3Data = await s3Response.json();
        const mappedData = this.mapResponseFromApi(s3Data);
        if (options?.schema) return options.schema.parse(mappedData);
        return mappedData as T;
      }

      const mappedData = this.mapResponseFromApi(data);
      if (options?.schema) return options.schema.parse(mappedData);
      return mappedData as T;
    }

    throw new Error(\`Unexpected content type: \${contentType}\`);
  }

  isAuthenticated(): boolean {
    return this.tokenManager.hasTokens();
  }

  getCustomerId(): number | null {
    return null;
  }
}
`;
}
