import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { CarService } from './service';
import { IRacingClient } from '../client';

// Import sample data
import carassetsSample from '../../samples/car.assets.json';
import cargetSample from '../../samples/car.get.json';

describe('CarService', () => {
  let mockFetch: Mock<any>;
  let client: IRacingClient;
  let carService: CarService;

  beforeEach(() => {
    mockFetch = mock<any>();

    client = new IRacingClient({
      auth: {
        type: 'authorization-code',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        tokens: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        },
      },
      fetchFn: mockFetch as any,
      validateParams: false,
      validateSemanticParams: false,
    });

    carService = new CarService(client);
  });

  describe('assets()', () => {
    it('should fetch and validate car assets data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(carassetsSample),
      });

      const result = await carService.assets();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://members-ng.iracing.com/data/car/assets',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-access-token',
          }),
        }),
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('get()', () => {
    it('should fetch and validate car get data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(cargetSample),
      });

      const result = await carService.get();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://members-ng.iracing.com/data/car/get',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-access-token',
          }),
        }),
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});
