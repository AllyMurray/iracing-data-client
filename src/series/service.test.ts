import { describe, it, expect, vi, beforeEach } from "vitest";
import { SeriesService } from "./service";
import type { IRacingClient } from "../client";
import type { SeriesAssetsResponse, SeriesGetResponse, SeriesPastSeasonsResponse, SeriesSeasonsResponse, SeriesSeasonListResponse, SeriesStatsSeriesResponse } from "./types";
import { SeriesAssets, SeriesGet, SeriesPastSeasons, SeriesSeasons, SeriesSeasonList, SeriesStatsSeries } from "./types";

// Import sample data
import seriesassetsSample from "../../samples/series.assets.json";
import seriesgetSample from "../../samples/series.get.json";
import seriespastseasonsSample from "../../samples/series.past_seasons.json";
import seriesseasonsSample from "../../samples/series.seasons.json";
import seriesseasonlistSample from "../../samples/series.season_list.json";
import seriesstatsseriesSample from "../../samples/series.stats_series.json";

describe("SeriesService", () => {
  let mockClient: IRacingClient;
  let seriesService: SeriesService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    seriesService = new SeriesService(mockClient);
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

      const expectedTransformedData = transformData(seriesassetsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await seriesService.assets();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/assets", { schema: SeriesAssets });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesAssetsResponse type structure", async () => {
      const mockData = {} as SeriesAssetsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await seriesService.assets();
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

      const expectedTransformedData = transformData(seriesgetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await seriesService.get();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/get", { schema: SeriesGet });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesGetResponse type structure", async () => {
      const mockData = {} as SeriesGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await seriesService.get();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("pastSeasons()", () => {
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

      const expectedTransformedData = transformData(seriespastseasonsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  seriesId: 123
      };
      const result = await seriesService.pastSeasons(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/past_seasons", { params: testParams, schema: SeriesPastSeasons });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesPastSeasonsResponse type structure", async () => {
      const mockData = {} as SeriesPastSeasonsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seriesId: 123
      };
      const result = await seriesService.pastSeasons(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasons()", () => {
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

      const expectedTransformedData = transformData(seriesseasonsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasons(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/seasons", { params: testParams, schema: SeriesSeasons });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesSeasonsResponse type structure", async () => {
      const mockData = {} as SeriesSeasonsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasons(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasonList()", () => {
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

      const expectedTransformedData = transformData(seriesseasonlistSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasonList(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/season_list", { params: testParams, schema: SeriesSeasonList });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesSeasonListResponse type structure", async () => {
      const mockData = {} as SeriesSeasonListResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasonList(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasonSchedule()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123
      };
      await seriesService.seasonSchedule(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/season_schedule", { params: testParams });
    });
  });

  describe("statsSeries()", () => {
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

      const expectedTransformedData = transformData(seriesstatsseriesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await seriesService.statsSeries();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/series/stats_series", { schema: SeriesStatsSeries });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching SeriesStatsSeriesResponse type structure", async () => {
      const mockData = {} as SeriesStatsSeriesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await seriesService.statsSeries();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});