import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import * as z from 'zod/mini';
import { type FetchLike } from '../auth/types';
import { DEFAULT_RETRY_OPTIONS, IRacingClient, IRacingError } from '../client';
import type { HttpClientEvent } from '@http-client-toolkit/core';
import { createMockResponse } from "./test-utils";

describe('HttpClient Integration', () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;

  const mockTokenResponse = {
    access_token: 'test-access-token',
    token_type: 'Bearer',
    expires_in: 600,
    refresh_token: 'test-refresh-token',
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new IRacingClient({
      auth: {
        type: 'password-limited',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        username: 'test@example.com',
        password: 'password',
      },
      fetchFn: mockFetch,
    });
  });

  describe('requestInterceptor injects auth headers', () => {
    it('should add Authorization header to requests', async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response (non-S3, direct JSON)
      mockFetch.mockResolvedValueOnce(createMockResponse({ some_data: 'value' }));

      await client.get('/data/test/endpoint');

      // Second call should be the API call with auth headers
      expect(mockFetch).toHaveBeenCalledTimes(2);
      const apiCall = mockFetch.mock.calls[1];
      expect(apiCall[1]).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-access-token',
          }),
        })
      );
    });
  });

  describe('fetchFn resolves S3 links', () => {
    it('should follow S3 link and return resolved data', async () => {
      const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();

      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with S3 link
      mockFetch.mockResolvedValueOnce(createMockResponse({ link: 'https://s3.example.com/data', expires: futureDate }));

      // Mock S3 response
      mockFetch.mockResolvedValueOnce(createMockResponse({ car_id: 123, car_name: 'Test Car' }));

      const result = await client.get('/data/car/get');

      expect(result).toEqual({ carId: 123, carName: 'Test Car' });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('fetchFn handles CSV S3 responses', () => {
    it('should wrap CSV data in JSON envelope with PascalCase keys', async () => {
      const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();
      const csvData = 'header1,header2\nvalue1,value2';

      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with S3 link
      mockFetch.mockResolvedValueOnce(createMockResponse({ link: 'https://s3.example.com/csv', expires: futureDate }));

      // Mock S3 CSV response
      mockFetch.mockResolvedValueOnce(createMockResponse(csvData, { headers: { "content-type": "text/csv" } }));

      const result = await client.get('/data/results/lap_data');

      // PascalCase keys preserved for backwards compatibility
      // mapResponseFromApi only converts snake_case/kebab-case, so PascalCase passes through
      expect(result).toEqual({
        ContentType: 'csv',
        RawData: csvData,
        Note: 'This endpoint returns CSV data, not JSON',
      });
    });
  });

  describe('fetchFn passes through non-S3 responses', () => {
    it('should return data directly for non-S3 JSON responses', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock direct API response (no link/expires)
      mockFetch.mockResolvedValueOnce(createMockResponse({ car_id: 456, car_name: 'Direct Car' }));

      const result = await client.get('/data/test/direct');

      expect(result).toEqual({ carId: 456, carName: 'Direct Car' });
      expect(mockFetch).toHaveBeenCalledTimes(2); // OAuth + API only, no S3
    });
  });

  describe('responseTransformer converts snake_case to camelCase', () => {
    it('should recursively convert response keys', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with nested snake_case
      mockFetch.mockResolvedValueOnce(createMockResponse({
            car_id: 1,
            car_name: 'Test',
            nested_object: {
              inner_key: 'value',
              deep_nested: { deep_key: 'deep' },
            },
            array_field: [{ item_id: 1 }, { item_id: 2 }],
          }));

      const result = await client.get('/data/test/nested');

      expect(result).toEqual({
        carId: 1,
        carName: 'Test',
        nestedObject: {
          innerKey: 'value',
          deepNested: { deepKey: 'deep' },
        },
        arrayField: [{ itemId: 1 }, { itemId: 2 }],
      });
    });
  });

  describe('errorHandler maps HTTP errors to IRacingError', () => {
    it('should throw IRacingError with responseData for 401 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      const errorBody = { error: 'unauthorized', message: 'Token expired' };
      mockFetch.mockResolvedValueOnce(createMockResponse(errorBody, { ok: false, status: 401, statusText: 'Unauthorized' }));

      try {
        await client.get('/data/test/auth');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(IRacingError);
        const err = e as IRacingError;
        expect(err.status).toBe(401);
        expect(err.isUnauthorized).toBe(true);
        expect(err.responseData).toEqual(errorBody);
        expect(err.url).toBe('https://members-ng.iracing.com/data/test/auth');
        expect(err.headers).toBeInstanceOf(Headers);
      }
    });

    it('should throw IRacingError for 429 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockResolvedValueOnce(createMockResponse('', { ok: false, status: 429, statusText: 'Too Many Requests' }));

      try {
        await client.get('/data/test/rate-limit');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(IRacingError);
        const err = e as IRacingError;
        expect(err.isRateLimited).toBe(true);
        expect(err.url).toBe('https://members-ng.iracing.com/data/test/rate-limit');
        expect(err.headers).toBeInstanceOf(Headers);
      }
    });

    it('should retry 429 responses when retry is configured', async () => {
      client = new IRacingClient({
        auth: {
          type: 'password-limited',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          username: 'test@example.com',
          password: 'password',
        },
        fetchFn: mockFetch,
        retry: {
          ...DEFAULT_RETRY_OPTIONS,
          maxRetries: 1,
          baseDelay: 1,
          jitter: 'none',
        },
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockResolvedValueOnce(createMockResponse('', { ok: false, status: 429, statusText: 'Too Many Requests' }));
      mockFetch.mockResolvedValueOnce(createMockResponse({ retry_ok: true }));

      const result = await client.get('/data/test/rate-limit-retry');

      expect(result).toEqual({ retryOk: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should distinguish maintenance mode from generic 503', async () => {
      // Maintenance mode: 503 with specific error body
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockResolvedValueOnce(createMockResponse(
        { error: 'Site Maintenance' },
        { ok: false, status: 503, statusText: 'Service Unavailable' },
      ));

      try {
        await client.get('/data/test/maintenance');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(IRacingError);
        const err = e as IRacingError;
        expect(err.isMaintenanceMode).toBe(true);
        expect(err.isServiceUnavailable).toBe(false);
        expect(err.url).toBe('https://members-ng.iracing.com/data/test/maintenance');
        expect(err.headers).toBeInstanceOf(Headers);
      }
    });

    it('should flag generic 503 as service unavailable, not maintenance', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockResolvedValueOnce(createMockResponse(
        '',
        { ok: false, status: 503, statusText: 'Service Unavailable' },
      ));

      try {
        await client.get('/data/test/unavailable');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(IRacingError);
        const err = e as IRacingError;
        expect(err.isMaintenanceMode).toBe(false);
        expect(err.isServiceUnavailable).toBe(true);
        expect(err.url).toBe('https://members-ng.iracing.com/data/test/unavailable');
        expect(err.headers).toBeInstanceOf(Headers);
      }
    });
  });

  describe('get() delegates to HttpClient and applies Zod validation', () => {
    it('should return data without schema validation when no schema provided', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ test_key: 'test_value' }));

      const result = await client.get('/data/test/no-schema');
      expect(result).toEqual({ testKey: 'test_value' });
    });

    it('should convert camelCase params to snake_case', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ result: 'ok' }));

      await client.get('/data/test/params', {
        params: { seasonYear: 2024, raceWeekNum: 5 },
      });

      // Check the URL has snake_case params
      const apiCall = mockFetch.mock.calls[1];
      const url = apiCall[0] as string;
      expect(url).toContain('season_year=2024');
      expect(url).toContain('race_week_num=5');
    });

    it('should validate params before making network requests', async () => {
      await expect(
        client.get('/data/test/params', {
          params: { custIds: 'not-an-array' },
          paramsValidator: z.object({
            custIds: z.array(z.number()),
          }),
        })
      ).rejects.toThrow();

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('stores are optional', () => {
    it('should work without stores (same as current behaviour)', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'value' }));

      const result = await client.get('/data/test/no-stores');
      expect(result).toBeDefined();
    });
  });

  describe('observability and pending requests', () => {
    it('should forward HttpClient observability events', async () => {
      const events: HttpClientEvent[] = [];
      client = new IRacingClient({
        auth: {
          type: 'password-limited',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          username: 'test@example.com',
          password: 'password',
        },
        fetchFn: mockFetch,
        observability: {
          onEvent: (event) => {
            events.push(event);
          },
        },
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockResolvedValueOnce(createMockResponse({ observed: true }));

      await client.get('/data/test/observability');

      expect(events.map((event) => event.type)).toContain('request:start');
      expect(events.map((event) => event.type)).toContain('request:success');
      expect(events.every((event) => event.clientName === 'iracing-data-client')).toBe(true);
      expect(events.every((event) => event.resourceKey === 'https://members-ng.iracing.com')).toBe(true);
    });

    it('should expose pending request counts', async () => {
      let resolveApiResponse!: (response: Response) => void;
      const apiResponse = new Promise<Response>((resolve) => {
        resolveApiResponse = resolve;
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));
      mockFetch.mockReturnValueOnce(apiResponse);

      const pending = client.get('/data/test/pending');

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(client.getPendingRequestCount()).toBe(1);
        expect(client.getPendingRequestCount('https://members-ng.iracing.com')).toBe(1);
      });

      resolveApiResponse(createMockResponse({ pending_done: true }));

      await expect(pending).resolves.toEqual({ pendingDone: true });
      expect(client.getPendingRequestCount()).toBe(0);
    });
  });
});
