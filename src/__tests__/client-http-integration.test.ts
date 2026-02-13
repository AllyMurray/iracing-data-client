import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { type FetchLike } from '../auth/types';
import { IRacingClient, IRacingError } from '../client';
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
    it('should throw IRacingError for 401 responses', async () => {
      // Mock OAuth
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock 401 response
      mockFetch.mockResolvedValueOnce(createMockResponse('', { ok: false, status: 401, statusText: 'Unauthorized' }));

      await expect(client.get('/data/test/auth')).rejects.toThrow(IRacingError);
      try {
        await client.get('/data/test/auth');
      } catch (e) {
        // The error from the first call is sufficient
      }
    });

    it('should throw IRacingError for 429 responses', async () => {
      // Mock OAuth (tokens already obtained from prior test setup, but fresh client)
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock 429 response
      mockFetch.mockResolvedValueOnce(createMockResponse('', { ok: false, status: 429, statusText: 'Too Many Requests' }));

      try {
        await client.get('/data/test/rate-limit');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(IRacingError);
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
});
