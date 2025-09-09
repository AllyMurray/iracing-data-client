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

// API Response Types
export interface RaceGuideSession {
  season_id: number;
  start_time: string;
  super_session: boolean;
  series_id: number;
  race_week_num: number;
  end_time: string;
  session_id: number;
  entry_count: number;
  split_count?: number;
}

export interface RaceGuideResponse {
  sessions: RaceGuideSession[];
}

export interface Series {
  series_id: number;
  series_name: string;
  series_short_name: string;
  active: boolean;
}

export interface RaceGuideParams extends Record<string, string | number | boolean | undefined> {
  from?: string;
  include_end_after_from?: boolean;
}

export interface Car {
  car_id: number;
  car_rules: any[];
  detail_copy: string;
  detail_screen_shot_images: string;
  detail_techspecs_copy: string;
  folder: string;
  gallery_images: string | null;
  gallery_prefix: string | null;
  group_image: string | null;
  group_name: string | null;
  large_image: string;
  logo: string;
  small_image: string;
  sponsor_logo: string | null;
  template_path: string;
}

export interface CarsResponse {
  [key: string]: Car;
}

/**
 * @example
 * ```typescript
 * const client = new IRacingClient({
 *   email: 'your-email@example.com',
 *   password: 'your-password'
 * });
 *
 * try {
 *   // Get league data
 *   const response = await client.makeAuthorizedRequest('/data/league/get', {
 *     league_id: 7058,
 *     include_license: true
 *   });
 *   const data = await response.json();
 *   console.log(data);
 *
 *   // Get member data
 *   const memberResponse = await client.makeAuthorizedRequest('/data/member/get', {
 *     cust_id: client.getCustomerId()
 *   });
 *   const memberData = await memberResponse.json();
 *   console.log(memberData);
 * } catch (error) {
 *   console.error('API error:', error);
 * }
 * ```
 */
export class IRacingClient {
  private baseUrl = 'https://members-ng.iracing.com';
  private authData: AuthResponse | null = null;
  private cookies: Record<string, string> | null = null;
  private email: string;
  private password: string;

  constructor(config: { email: string; password: string }) {
    this.email = config.email;
    this.password = config.password;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.authData) {
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const authData = await response.json();
    this.authData = authData;

    // Parse and store cookies
    this.cookies = {
      'irsso_membersv2': authData.ssoCookieValue,
      'authtoken_members': `%7B%22authtoken%22%3A%7B%22authcode%22%3A%22${authData.authcode}%22%2C%22email%22%3A%22${encodeURIComponent(authData.email)}%22%7D%7D`
    };
  }

  async makeAuthorizedRequest<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    options: RequestInit = {}
  ): Promise<T> {
    await this.ensureAuthenticated();

    const headers = new Headers(options.headers);

    if (!this.cookies) {
      throw new Error('Cookies not initialized');
    }

    // Set all cookies in the Cookie header
    const cookieString = Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    headers.set('Cookie', cookieString);

    const response = await fetch(this.buildUrl(endpoint, params), {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const s3Data: S3Response = await response.json();

    // Fetch the actual data from the S3 bucket
    const dataResponse = await fetch(s3Data.link);
    if (!dataResponse.ok) {
      throw new Error(`Failed to fetch data from S3: ${dataResponse.statusText}`);
    }

    return dataResponse.json();
  }

  isAuthenticated(): boolean {
    return this.authData !== null;
  }

  getCustomerId(): number | null {
    return this.authData?.custId ?? null;
  }

  // API Endpoints
  async getRaceGuide(params?: RaceGuideParams): Promise<RaceGuideResponse> {
    return this.makeAuthorizedRequest<RaceGuideResponse>('/data/season/race_guide', params as Record<string, string | number | boolean>);
  }

  async getSeries(): Promise<Series[]> {
    return this.makeAuthorizedRequest<Series[]>('/data/series');
  }

  async getCarAssets(): Promise<CarsResponse> {
    return this.makeAuthorizedRequest<CarsResponse>('/data/car/assets');
  }

  // Get car info which includes class data
  async getCars(): Promise<any> {
    return this.makeAuthorizedRequest<any>('/data/car/get');
  }

  // Get car class data from the dedicated endpoint
  async getCarClasses(): Promise<any> {
    return this.makeAuthorizedRequest<any>('/data/carclass/get');
  }
}



