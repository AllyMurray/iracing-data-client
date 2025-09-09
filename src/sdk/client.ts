import * as z from "zod/mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const IRacingClientOptionsSchema = z.object({
  email: z.optional(z.string()),
  password: z.optional(z.string()),
  headers: z.optional(z.record(z.string(), z.string())),
  fetchFn: z.optional(z.any()),
  validateParams: z.optional(z.boolean()),
});

export type IRacingClientOptions = z.infer<typeof IRacingClientOptionsSchema>;

interface AuthResponse {
  authcode: string;
  autoLoginSeries: null | string;
  autoLoginToken: null | string;
  custId: number;
  email: string;
  ssoCookieDomain: string;
  ssoCookieName: string;
  ssoCookiePath: string;
  ssoCookieValue: string;
}

interface S3Response {
  link: string;
  expires: string;
}

type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingClient {
  private baseUrl = 'https://members-ng.iracing.com';
  private fetchFn: FetchLike;
  private authData: AuthResponse | null = null;
  private cookies: Record<string, string> | null = null;
  private email?: string;
  private password?: string;
  private presetHeaders?: Record<string, string>;
  private validateParams: boolean;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    const validatedOpts = IRacingClientOptionsSchema.parse(opts);
    
    this.fetchFn = validatedOpts.fetchFn ?? (globalThis as any).fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");
    
    this.email = validatedOpts.email;
    this.password = validatedOpts.password;
    this.presetHeaders = validatedOpts.headers as Record<string, string> | undefined;
    this.validateParams = validatedOpts.validateParams ?? true;
    
    if (!this.email && !this.password && !this.presetHeaders) {
      throw new Error("Must provide either email/password or headers for authentication");
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(","));
          } else if (typeof value === "boolean") {
            url.searchParams.append(key, value ? "true" : "false");
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.presetHeaders) {
      // Using preset headers, no authentication needed
      return;
    }
    
    if (!this.authData && this.email && this.password) {
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    if (!this.email || !this.password) {
      throw new Error("Email and password required for authentication");
    }

    const response = await this.fetchFn(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: this.email, 
        password: this.password 
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Authentication failed: ${response.statusText} - ${text}`);
    }

    this.authData = await response.json();
    
    // Parse and store cookies
    if (!this.authData) {
      throw new Error('Authentication failed - no auth data received');
    }
    
    this.cookies = {
      'irsso_membersv2': this.authData.ssoCookieValue,
      'authtoken_members': `%7B%22authtoken%22%3A%7B%22authcode%22%3A%22${this.authData.authcode}%22%2C%22email%22%3A%22${encodeURIComponent(this.authData.email)}%22%7D%7D`
    };
  }

  private mapParamsToApi(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
      mapped[snakeKey] = value;
    }
    return mapped;
  }


  async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    await this.ensureAuthenticated();

    // Convert camelCase params back to snake_case for the API
    const apiParams = this.mapParamsToApi(params);
    
    const headers: Record<string, string> = {};
    
    if (this.presetHeaders) {
      // Use preset headers (like cookies from manual auth)
      Object.assign(headers, this.presetHeaders);
    } else if (this.cookies) {
      // Use authenticated cookies
      const cookieString = Object.entries(this.cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
      headers['Cookie'] = cookieString;
    } else {
      throw new Error('No authentication available');
    }

    const response = await this.fetchFn(this.buildUrl(url, apiParams), {
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const contentType = response.headers.get("content-type") || "";
    
    // Check if this is a direct JSON response (some endpoints don't use S3)
    if (contentType.includes("application/json")) {
      const data = await response.json();
      
      // Check if it's an S3 link response
      if (data.link && data.expires) {
        // Fetch the actual data from S3
        const s3Response = await this.fetchFn(data.link);
        if (!s3Response.ok) {
          throw new Error(`Failed to fetch from S3: ${s3Response.statusText}`);
        }
        
        // Check content type of S3 response
        const s3ContentType = s3Response.headers.get("content-type") || "";
        if (s3ContentType.includes("text/csv") || s3ContentType.includes("text/plain")) {
          // Return CSV as raw text wrapped in an object
          const csvText = await s3Response.text();
          return { 
            _contentType: "csv", 
            _rawData: csvText,
            _note: "This endpoint returns CSV data, not JSON" 
          } as T;
        }
        
        return s3Response.json() as Promise<T>;
      }
      
      return data;
    }

    throw new Error(`Unexpected content type: ${contentType}`);
  }

  isAuthenticated(): boolean {
    return this.authData !== null || !!this.presetHeaders;
  }

  getCustomerId(): number | null {
    return this.authData?.custId ?? null;
  }
}
