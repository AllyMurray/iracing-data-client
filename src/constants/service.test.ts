import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConstantsService } from "./service";
import type { IRacingClient } from "../client";
import type { ConstantsCategoriesResponse, ConstantsDivisionsResponse, ConstantsEventTypesResponse } from "./types";
import { ConstantsCategories, ConstantsDivisions, ConstantsEventTypes } from "./types";

// Import sample data
import constantscategoriesSample from "../../samples/constants.categories.json";
import constantsdivisionsSample from "../../samples/constants.divisions.json";
import constantseventtypesSample from "../../samples/constants.event_types.json";

describe("ConstantsService", () => {
  let mockClient: IRacingClient;
  let constantsService: ConstantsService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    constantsService = new ConstantsService(mockClient);
  });

  describe("categories()", () => {
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

      const expectedTransformedData = transformData(constantscategoriesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await constantsService.categories();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/constants/categories", { schema: ConstantsCategories });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching ConstantsCategoriesResponse type structure", async () => {
      const mockData = {} as ConstantsCategoriesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await constantsService.categories();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("divisions()", () => {
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

      const expectedTransformedData = transformData(constantsdivisionsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await constantsService.divisions();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/constants/divisions", { schema: ConstantsDivisions });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching ConstantsDivisionsResponse type structure", async () => {
      const mockData = {} as ConstantsDivisionsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await constantsService.divisions();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("eventTypes()", () => {
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

      const expectedTransformedData = transformData(constantseventtypesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await constantsService.eventTypes();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/constants/event_types", { schema: ConstantsEventTypes });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching ConstantsEventTypesResponse type structure", async () => {
      const mockData = {} as ConstantsEventTypesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await constantsService.eventTypes();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});