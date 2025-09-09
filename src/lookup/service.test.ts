import { describe, it, expect, vi, beforeEach } from "vitest";
import { LookupService } from "./service";
import type { IRacingClient } from "../client";
import type { LookupCountriesResponse, LookupDriversResponse, LookupFlairsResponse, LookupGetResponse, LookupLicensesResponse } from "./types";
import { LookupCountriesSchema, LookupDriversSchema, LookupFlairsSchema, LookupGetSchema, LookupLicensesSchema } from "./types";

// Import sample data
import lookupcountriesSample from "../../samples/lookup.countries.json";
import lookupdriversSample from "../../samples/lookup.drivers.json";
import lookupflairsSample from "../../samples/lookup.flairs.json";
import lookupgetSample from "../../samples/lookup.get.json";
import lookuplicensesSample from "../../samples/lookup.licenses.json";

describe("LookupService", () => {
  let mockClient: IRacingClient;
  let lookupService: LookupService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    lookupService = new LookupService(mockClient);
  });

  describe("countries()", () => {
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

      const expectedTransformedData = transformData(lookupcountriesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await lookupService.countries();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/lookup/countries", { schema: LookupCountriesSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LookupCountriesResponse type structure", async () => {
      const mockData = {} as LookupCountriesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await lookupService.countries();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("drivers()", () => {
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

      const expectedTransformedData = transformData(lookupdriversSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  searchTerm: "test",
  leagueId: 123
      };
      const result = await lookupService.drivers(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/lookup/drivers", { params: testParams, schema: LookupDriversSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LookupDriversResponse type structure", async () => {
      const mockData = {} as LookupDriversResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  searchTerm: "test",
  leagueId: 123
      };
      const result = await lookupService.drivers(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("flairs()", () => {
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

      const expectedTransformedData = transformData(lookupflairsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await lookupService.flairs();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/lookup/flairs", { schema: LookupFlairsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LookupFlairsResponse type structure", async () => {
      const mockData = {} as LookupFlairsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await lookupService.flairs();
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

      const expectedTransformedData = transformData(lookupgetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await lookupService.get();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/lookup/get", { schema: LookupGetSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LookupGetResponse type structure", async () => {
      const mockData = {} as LookupGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await lookupService.get();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("licenses()", () => {
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

      const expectedTransformedData = transformData(lookuplicensesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await lookupService.licenses();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/lookup/licenses", { schema: LookupLicensesSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LookupLicensesResponse type structure", async () => {
      const mockData = {} as LookupLicensesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await lookupService.licenses();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});