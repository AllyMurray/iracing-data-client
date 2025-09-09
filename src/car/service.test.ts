import { describe, it, expect, vi, beforeEach } from "vitest";
import { CarService } from "./service";
import type { IRacingClient } from "../client";
import type { CarAssetsResponse, CarGetResponse } from "./types";
import { CarAssets, CarGet } from "./types";

// Import sample data
import carassetsSample from "../../samples/car.assets.json";
import cargetSample from "../../samples/car.get.json";

describe("CarService", () => {
  let mockClient: IRacingClient;
  let carService: CarService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    carService = new CarService(mockClient);
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

      const expectedTransformedData = transformData(carassetsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await carService.assets();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/car/assets", { schema: CarAssets });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching CarAssetsResponse type structure", async () => {
      const mockData = {} as CarAssetsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await carService.assets();
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

      const expectedTransformedData = transformData(cargetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await carService.get();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/car/get", { schema: CarGet });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching CarGetResponse type structure", async () => {
      const mockData = {} as CarGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await carService.get();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});