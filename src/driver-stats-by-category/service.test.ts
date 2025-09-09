import { describe, it, expect, vi, beforeEach } from "vitest";
import { DriverStatsByCategoryService } from "./service";
import type { IRacingClient } from "../client";
import type { DriverStatsByCategoryOvalResponse, DriverStatsByCategorySportsCarResponse, DriverStatsByCategoryFormulaCarResponse, DriverStatsByCategoryRoadResponse, DriverStatsByCategoryDirtOvalResponse, DriverStatsByCategoryDirtRoadResponse } from "./types";
import { DriverStatsByCategoryOvalSchema, DriverStatsByCategorySportsCarSchema, DriverStatsByCategoryFormulaCarSchema, DriverStatsByCategoryRoadSchema, DriverStatsByCategoryDirtOvalSchema, DriverStatsByCategoryDirtRoadSchema } from "./types";

// Import sample data
import driverstatsbycategoryovalSample from "../../samples/driver_stats_by_category.oval.json";
import driverstatsbycategorysportscarSample from "../../samples/driver_stats_by_category.sports_car.json";
import driverstatsbycategoryformulacarSample from "../../samples/driver_stats_by_category.formula_car.json";
import driverstatsbycategoryroadSample from "../../samples/driver_stats_by_category.road.json";
import driverstatsbycategorydirtovalSample from "../../samples/driver_stats_by_category.dirt_oval.json";
import driverstatsbycategorydirtroadSample from "../../samples/driver_stats_by_category.dirt_road.json";

describe("DriverStatsByCategoryService", () => {
  let mockClient: IRacingClient;
  let driverStatsByCategoryService: DriverStatsByCategoryService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    driverStatsByCategoryService = new DriverStatsByCategoryService(mockClient);
  });

  describe("oval()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategoryovalSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.oval();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/oval", { schema: DriverStatsByCategoryOvalSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategoryOvalResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategoryOvalResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.oval();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("sportsCar()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategorysportscarSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.sportsCar();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/sports_car", { schema: DriverStatsByCategorySportsCarSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategorySportsCarResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategorySportsCarResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.sportsCar();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("formulaCar()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategoryformulacarSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.formulaCar();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/formula_car", { schema: DriverStatsByCategoryFormulaCarSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategoryFormulaCarResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategoryFormulaCarResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.formulaCar();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("road()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategoryroadSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.road();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/road", { schema: DriverStatsByCategoryRoadSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategoryRoadResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategoryRoadResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.road();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("dirtOval()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategorydirtovalSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.dirtOval();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval", { schema: DriverStatsByCategoryDirtOvalSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategoryDirtOvalResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategoryDirtOvalResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.dirtOval();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("dirtRoad()", () => {
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

      const expectedTransformedData = transformData(driverstatsbycategorydirtroadSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await driverStatsByCategoryService.dirtRoad();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road", { schema: DriverStatsByCategoryDirtRoadSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching DriverStatsByCategoryDirtRoadResponse type structure", async () => {
      const mockData = {} as DriverStatsByCategoryDirtRoadResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await driverStatsByCategoryService.dirtRoad();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});