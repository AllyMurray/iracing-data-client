import { describe, it, expect, vi, beforeEach } from "vitest";
import { SeasonService } from "./service";
import type { IRacingClient } from "../client";
import type { SeasonListResponse, SeasonRaceGuideResponse, SeasonSpectatorSubsessionidsResponse, SeasonSpectatorSubsessionidsDetailResponse } from "./types";
import { SeasonList, SeasonRaceGuide, SeasonSpectatorSubsessionids, SeasonSpectatorSubsessionidsDetail } from "./types";

// Import sample data
import seasonlistSample from "../../samples/season.list.json";
import seasonraceguideSample from "../../samples/season.race_guide.json";
import seasonspectatorsubsessionidsSample from "../../samples/season.spectator_subsessionids.json";
import seasonspectatorsubsessionidsdetailSample from "../../samples/season.spectator_subsessionids_detail.json";

describe("SeasonService", () => {
  let mockClient: IRacingClient;
  let seasonService: SeasonService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    seasonService = new SeasonService(mockClient);
  });

  describe("list()", () => {
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

      const expectedTransformedData = transformData(seasonlistSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seasonService.list(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/season/list", { params: testParams, schema: SeasonList });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeasonListResponse type structure", async () => {
      const mockData = {} as SeasonListResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seasonService.list(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("raceGuide()", () => {
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

      const expectedTransformedData = transformData(seasonraceguideSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  from: "test",
  includeEndAfterFrom: true
      };
      const result = await seasonService.raceGuide(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/season/race_guide", { params: testParams, schema: SeasonRaceGuide });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeasonRaceGuideResponse type structure", async () => {
      const mockData = {} as SeasonRaceGuideResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  from: "test",
  includeEndAfterFrom: true
      };
      const result = await seasonService.raceGuide(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("spectatorSubsessionids()", () => {
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

      const expectedTransformedData = transformData(seasonspectatorsubsessionidsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  eventTypes: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionids(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/season/spectator_subsessionids", { params: testParams, schema: SeasonSpectatorSubsessionids });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeasonSpectatorSubsessionidsResponse type structure", async () => {
      const mockData = {} as SeasonSpectatorSubsessionidsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  eventTypes: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionids(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("spectatorSubsessionidsDetail()", () => {
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

      const expectedTransformedData = transformData(seasonspectatorsubsessionidsdetailSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  eventTypes: [123, 456],
  seasonIds: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionidsDetail(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail", { params: testParams, schema: SeasonSpectatorSubsessionidsDetail });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeasonSpectatorSubsessionidsDetailResponse type structure", async () => {
      const mockData = {} as SeasonSpectatorSubsessionidsDetailResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  eventTypes: [123, 456],
  seasonIds: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionidsDetail(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});