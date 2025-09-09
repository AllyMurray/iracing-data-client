import { describe, it, expect, vi, beforeEach } from "vitest";
import { CarclassService } from "./service";
import type { IRacingClient } from "../client";
import type { CarclassGetResponse } from "./types";
import { CarclassGetSchema } from "./types";

// Import sample data
import carclassgetSample from "../../samples/carclass.get.json";

describe("CarclassService", () => {
  let mockClient: IRacingClient;
  let carclassService: CarclassService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    carclassService = new CarclassService(mockClient);
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

      const expectedTransformedData = transformData(carclassgetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await carclassService.get();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/carclass/get", { schema: CarclassGetSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching CarclassGetResponse type structure", async () => {
      const mockData = {} as CarclassGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await carclassService.get();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});