import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrackService } from "./service";
import type { IRacingClient } from "../client";
import type { TrackAssetsResponse, TrackGetResponse } from "./types";
import { TrackAssetsSchema, TrackGetSchema } from "./types";

// Import sample data
import trackassetsSample from "../../samples/track.assets.json";
import trackgetSample from "../../samples/track.get.json";

describe("TrackService", () => {
  let mockClient: IRacingClient;
  let trackService: TrackService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    trackService = new TrackService(mockClient);
  });

  describe("assets()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(trackassetsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await trackService.assets();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/track/assets", { schema: TrackAssetsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching TrackAssetsResponse type structure", async () => {
      const mockData = {} as TrackAssetsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await trackService.assets();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("get()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(trackgetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await trackService.get();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/track/get", { schema: TrackGetSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching TrackGetResponse type structure", async () => {
      const mockData = {} as TrackGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await trackService.get();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});