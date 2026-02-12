# Integration Prompt: http-client-toolkit/core → iracing-data-client

## Objective

Integrate `@http-client-toolkit/core` into `iracing-data-client` so that HTTP concerns (caching, deduplication, rate limiting) are delegated to HttpClient, while iRacing-specific concerns (auth, S3 link resolution, case mapping, Zod validation) are wired in via HttpClient's hook points.

**This must be a non-breaking change.** When no `stores` are passed, behaviour is identical to today.

---

## Background: How @http-client-toolkit/core Works

```typescript
import { HttpClient, type HttpClientOptions, type HttpClientStores } from '@http-client-toolkit/core';

interface HttpClientOptions {
  fetchFn?: (url: string, init?: RequestInit) => Promise<Response>;
  requestInterceptor?: (url: string, init: RequestInit) => Promise<RequestInit> | RequestInit;
  responseInterceptor?: (response: Response, url: string) => Promise<Response> | Response;
  defaultCacheTTL?: number;
  throwOnRateLimit?: boolean;
  maxWaitTime?: number;
  responseTransformer?: (data: unknown) => unknown;
  errorHandler?: (error: unknown) => Error;
  responseHandler?: (data: unknown) => unknown;
  rateLimitHeaders?: { limit: string; remaining: string; reset: string };
  cacheOverrides?: Record<string, number>;
}

interface HttpClientStores {
  cache?: CacheStore;
  dedupe?: DedupeStore;
  rateLimit?: RateLimitStore | AdaptiveRateLimitStore;
}
```

**Execution order:** `requestInterceptor` → `fetchFn` → `responseInterceptor` → parse body → `responseTransformer` → `responseHandler` → cache

HttpClient's `get<T>(url)` returns parsed, transformed data of type `T`.

---

## Current Architecture (What Exists Today)

Repository: https://github.com/AllyMurray/iracing-data-client

### Key file: `src/client.ts`

`IRacingClient` currently does **everything** in its `get()` method:

1. `ensureAuthenticated()` → gets Bearer token via TokenManager
2. `mapParamsToApi()` → camelCase → snake_case on query params
3. `this.fetchFn(url, { headers })` → makes the HTTP call
4. Error handling → parses error response, throws `IRacingError` with status-specific messages
5. S3 link resolution → if response has `{ link, expires }`, fetches the S3 URL
6. CSV handling → if S3 response is CSV, returns `{ ContentType: 'csv', RawData: text }`
7. `mapResponseFromApi()` → snake_case → camelCase on response data (recursive)
8. Zod validation → `schema.parse(mappedData)` if schema provided

### Key file: `src/index.ts`

`IRacingDataClient` is the public-facing class. It creates `IRacingClient` and passes it to service classes:

```typescript
class IRacingDataClient {
  constructor(options: IRacingClientOptions) {
    this.client = new IRacingClient(options);
    this.car = new CarService(this.client);
    // ... etc
  }
}
```

### Service pattern (e.g. `src/car/service.ts`)

```typescript
class CarService {
  constructor(private client: IRacingClient) {}
  async assets(): Promise<CarAssetsResponse> {
    return this.client.get<CarAssetsResponse>(url, { schema: CarAssets });
  }
}
```

Services are **auto-generated** — do not modify them.

---

## Integration Design

### Mapping iRacing concerns to HttpClient hooks

| iRacing concern | HttpClient hook | Why |
|---|---|---|
| Auth header injection | `requestInterceptor` | Runs before every request; adds `Authorization: Bearer <token>` |
| S3 link resolution + CSV handling | `fetchFn` | Custom fetch that resolves `{link, expires}` → follows S3 URL → synthesises cache-control headers from `expires` |
| snake_case → camelCase mapping | `responseTransformer` | Transforms parsed JSON body before caching (so cached data is already camelCase) |
| IRacingError mapping | `errorHandler` | Converts HTTP errors into IRacingError instances with status-specific messages |
| Zod schema validation | **stays in IRacingClient.get()** | Per-request concern; HttpClient has no schema concept |
| camelCase → snake_case params | **stays in IRacingClient.get()** | Happens before URL construction, not an HTTP concern |

---

## Changes Required

### 1. Add dependency

```bash
pnpm add @http-client-toolkit/core@^0.x.x  # use latest 0.x
```

Add to `dependencies` in `package.json` alongside `zod`.

### 2. Update `src/client.ts`

#### 2a. New IRacingClientOptions interface

```typescript
import { HttpClient, type HttpClientStores } from '@http-client-toolkit/core';

export interface IRacingClientOptions {
  /** Authentication configuration */
  auth: AuthConfig;

  /** Custom fetch implementation (passed through to HttpClient's fetchFn wrapper) */
  fetchFn?: FetchLike;

  /** Enable runtime param validation against Zod schemas. @default true */
  validateParams?: boolean;

  /**
   * Optional stores for caching, deduplication, and rate limiting.
   * When omitted, HttpClient operates without stores (same as current behaviour).
   */
  stores?: HttpClientStores;
}
```

**Breaking change analysis:** Only addition is `stores?: HttpClientStores`. Existing consumers are unaffected.

#### 2b. Constructor changes

```typescript
export class IRacingClient {
  private readonly userFetchFn: FetchLike;
  private readonly authConfig: AuthConfig;
  private readonly tokenManager: TokenManager;
  private readonly validateParams: boolean;
  private readonly httpClient: HttpClient;

  private authenticationPromise: Promise<void> | null = null;

  constructor(options: IRacingClientOptions) {
    this.userFetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis);
    if (!this.userFetchFn) {
      throw new Error('No fetch available. Pass fetchFn in IRacingClientOptions.');
    }

    this.authConfig = options.auth;
    this.validateParams = options.validateParams ?? true;

    // Initialize token manager (unchanged)
    this.tokenManager = new TokenManager({
      clientId: options.auth.clientId,
      clientSecret: options.auth.clientSecret,
      fetchFn: this.userFetchFn,
      onTokenRefresh: options.auth.onTokenRefresh,
    });

    // Initialize with pre-obtained tokens if provided (unchanged)
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

    // Create HttpClient with iRacing-specific hooks
    this.httpClient = new HttpClient(
      {
        fetchFn: this.createFetchFn(),
        requestInterceptor: this.createRequestInterceptor(),
        responseTransformer: (data) => this.mapResponseFromApi(data),
        errorHandler: (error) => this.mapError(error),
      },
      options.stores,
    );
  }
```

#### 2c. The fetchFn implementation (S3 link resolution + cache headers + CSV)

This is the most complex piece. The `fetchFn` wraps the user's fetch to:
1. Make the initial API call
2. If the response is `{ link, expires }`, follow the S3 link
3. Synthesise a `Cache-Control` header from the `expires` field so HttpClient's cache respects it
4. Handle CSV responses from S3

```typescript
private createFetchFn(): (url: string, init?: RequestInit) => Promise<Response> {
  return async (url: string, init?: RequestInit): Promise<Response> => {
    const response = await this.userFetchFn(url, init);

    if (!response.ok) {
      // Let HttpClient's error pipeline handle this
      return response;
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
    const s3Response = await this.userFetchFn(data.link);

    if (!s3Response.ok) {
      throw new IRacingError(
        `Failed to fetch from S3: ${s3Response.statusText}`,
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
        contentType: 'csv',
        rawData: csvText,
        note: 'This endpoint returns CSV data, not JSON',
      });

      return new Response(csvPayload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `max-age=${maxAge}`,
        },
      });
    }

    // JSON S3 response — re-wrap with cache headers
    const s3Body = await s3Response.text();
    return new Response(s3Body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `max-age=${maxAge}`,
      },
    });
  };
}
```

> **Key insight:** By resolving S3 links inside `fetchFn`, HttpClient caches the *resolved data* (keyed by the original API URL), not the ephemeral S3 link. The synthesised `Cache-Control` header tells HttpClient how long to cache it.

#### 2d. The requestInterceptor (auth header injection)

```typescript
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
```

#### 2e. The errorHandler (IRacingError mapping)

```typescript
private mapError(error: unknown): IRacingError {
  if (error instanceof IRacingError) {
    return error;
  }

  if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
    const resp = error as Response;
    const status = resp.status;

    if (status === 503) {
      return new IRacingError(
        'iRacing is currently in maintenance mode',
        503,
        resp.statusText,
      );
    }
    if (status === 429) {
      return new IRacingError(
        'Rate limit exceeded. Please wait before making more requests.',
        429,
        resp.statusText,
      );
    }
    if (status === 401) {
      return new IRacingError(
        'Authentication failed. Please check your credentials.',
        401,
        resp.statusText,
      );
    }

    return new IRacingError(
      `Request failed: ${resp.statusText}`,
      status,
      resp.statusText,
    );
  }

  if (error instanceof Error) {
    return new IRacingError(error.message);
  }

  return new IRacingError(String(error));
}
```

> **Note:** Study how `@http-client-toolkit/core` invokes `errorHandler` — it may pass the raw error, a Response object, or a parsed error. Adapt the signature accordingly. The `errorHandler` in HttpClientOptions expects `(error: unknown) => Error`, so returning `IRacingError` (which extends `Error`) is correct.

#### 2f. The responseTransformer (snake → camel)

Reuse the existing `mapResponseFromApi` method — it's already recursive and handles arrays/objects:

```typescript
responseTransformer: (data) => this.mapResponseFromApi(data),
```

No changes needed to `mapResponseFromApi` itself.

#### 2g. Updated get() method

The `get()` method becomes dramatically simpler — it delegates to HttpClient:

```typescript
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
  if (options?.schema) {
    return options.schema.parse(data);
  }

  return data;
}
```

**What moved out of get():**
- ❌ `ensureAuthenticated()` → now in requestInterceptor
- ❌ `getAuthHeaders()` → now in requestInterceptor
- ❌ `this.fetchFn(url, { headers })` → now in HttpClient via fetchFn
- ❌ Error response parsing → now in errorHandler
- ❌ S3 link resolution → now in fetchFn
- ❌ CSV handling → now in fetchFn
- ❌ `mapResponseFromApi()` → now in responseTransformer

**What stays:**
- ✅ `mapParamsToApi()` + `buildUrl()` — param construction
- ✅ Zod schema validation — per-request concern

### 3. Update `src/index.ts`

Re-export the stores type so consumers can pass stores:

```typescript
// Add to existing exports
export type { HttpClientStores } from '@http-client-toolkit/core';
```

### 4. CSV response type change (minor)

The current CSV response uses `ContentType`, `RawData`, `Note` (PascalCase). The new fetchFn creates `contentType`, `rawData`, `note` (camelCase) which then goes through `responseTransformer` — but since the keys are already camelCase, they pass through unchanged. **However**, this changes the shape from the current PascalCase to camelCase.

**Decision:** This is arguably a bug fix (the rest of the API returns camelCase). Document it in CHANGELOG. If strict backwards compat is needed, keep PascalCase in the fetchFn's JSON.stringify.

### 5. Keep existing methods

These methods stay unchanged:
- `ensureAuthenticated()` — still needed (called by requestInterceptor now instead of get())
- `authenticatePasswordLimited()`
- `getAuthHeaders()`
- `buildUrl()`
- `mapParamsToApi()`
- `mapResponseFromApi()`
- `isAuthenticated()`
- `clearTokens()`

### 6. Remove from get()

Delete the entire error handling block, S3 resolution block, and direct fetch call from `get()`. It should be ~10 lines.

---

## Consumer Usage: Before & After

### Before (current — still works after change)

```typescript
import { IRacingDataClient } from 'iracing-data-client';

const client = new IRacingDataClient({
  auth: {
    flow: 'password-limited',
    clientId: 'my-app',
    clientSecret: 'secret',
    username: 'user@example.com',
    password: 'pass',
  },
});

const cars = await client.car.get();
```

### After (with caching enabled)

```typescript
import { IRacingDataClient } from 'iracing-data-client';
import { MemoryCacheStore, MemoryDedupeStore } from '@http-client-toolkit/core';

const client = new IRacingDataClient({
  auth: {
    flow: 'password-limited',
    clientId: 'my-app',
    clientSecret: 'secret',
    username: 'user@example.com',
    password: 'pass',
  },
  stores: {
    cache: new MemoryCacheStore(),
    dedupe: new MemoryDedupeStore(),
  },
});

// First call → hits iRacing API → resolves S3 → caches result
const cars = await client.car.get();

// Second call (within TTL) → served from cache
const carsAgain = await client.car.get();
```

---

## Test Requirements

### Unit tests for new hook functions

Create `src/__tests__/client-http-integration.test.ts`:

1. **requestInterceptor injects auth headers**
   - Mock TokenManager to return a known token
   - Verify the interceptor adds `Authorization: Bearer <token>` to init.headers
   - Verify `ensureAuthenticated()` is called

2. **fetchFn resolves S3 links**
   - Mock fetch to return `{ link: 'https://s3...', expires: '<future>' }`
   - Mock S3 fetch to return JSON data
   - Verify the returned Response body contains the S3 data (not the link envelope)
   - Verify Cache-Control header has correct max-age derived from expires

3. **fetchFn handles CSV S3 responses**
   - Mock S3 response with `content-type: text/csv`
   - Verify returned Response body is JSON-wrapped CSV `{ contentType: 'csv', rawData: '...' }`

4. **fetchFn passes through non-S3 responses**
   - Mock fetch to return plain JSON (no link/expires)
   - Verify response is returned as-is

5. **responseTransformer converts snake_case to camelCase**
   - Already tested — ensure existing mapResponseFromApi tests still pass

6. **errorHandler maps HTTP errors to IRacingError**
   - Test 401 → `isUnauthorized`
   - Test 429 → `isRateLimited`
   - Test 503 + maintenance → `isMaintenanceMode`
   - Test generic errors

7. **get() delegates to HttpClient and applies Zod validation**
   - Mock HttpClient.get to return data
   - Verify schema.parse is called when schema provided
   - Verify it passes without schema

8. **Integration: stores are optional**
   - Construct IRacingClient without stores — should work identically to today
   - Construct with MemoryCacheStore — second identical request should not call fetch again

### Existing tests

All existing tests in the repo must continue to pass without modification. The refactor should be transparent to the service layer.

---

## Dependency Version

Use `@http-client-toolkit/core` at whatever the latest published version is. Pin with caret (`^`):

```json
"dependencies": {
  "@http-client-toolkit/core": "^0.x.x",
  "zod": "4.1.5"
}
```

Check npm for the actual latest version at implementation time.

---

## Files Changed Summary

| File | Change |
|---|---|
| `package.json` | Add `@http-client-toolkit/core` dependency |
| `src/client.ts` | Add HttpClient integration, simplify get(), add hook factory methods |
| `src/index.ts` | Re-export `HttpClientStores` type |
| `src/__tests__/client-http-integration.test.ts` | **New** — tests for hook functions and integration |

**Files NOT changed:** All service files (`src/*/service.ts`), all type files, auth module, `IRacingDataClient` facade class.

---

## Implementation Notes

1. **`ensureAuthenticated()` is async** — the requestInterceptor must be async. HttpClient supports `Promise<RequestInit>` return from requestInterceptor, which is correct.

2. **Response.clone()** — in the fetchFn, we need to peek at the JSON body to check for `{link, expires}`. Use `response.clone()` before reading, so we can return the original if it's not an S3 link.

3. **Error propagation** — verify how HttpClient calls `errorHandler`. If HttpClient catches fetch errors and passes them to errorHandler, the current approach works. If HttpClient expects errorHandler to only transform already-thrown errors, adjust accordingly. Read the HttpClient source to confirm.

4. **Cache key** — HttpClient will cache by the original API URL (e.g., `https://members-ng.iracing.com/data/car/get`), not the S3 URL. This is correct because S3 URLs are ephemeral.

5. **CSV response shape** — consider whether to keep PascalCase (`ContentType`, `RawData`) for backwards compat or switch to camelCase. Document whichever choice is made.

6. **The `responseInterceptor` hook is NOT used** — we don't need to intercept the raw Response after fetchFn. All our work happens either in fetchFn (S3 resolution) or responseTransformer (case mapping).
