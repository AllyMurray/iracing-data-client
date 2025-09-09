import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResultsService } from "./service";
import type { IRacingClient } from "../client";

describe("ResultsService", () => {
  let mockClient: IRacingClient;
  let resultsService: ResultsService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    resultsService = new ResultsService(mockClient);
  });

  describe("get()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  subsessionId: 123,
  includeLicenses: true
      };
      await resultsService.get(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/get", { params: testParams });
    });
  });

  describe("eventLog()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      await resultsService.eventLog(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/event_log", { params: testParams });
    });
  });

  describe("lapChartData()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      await resultsService.lapChartData(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/lap_chart_data", { params: testParams });
    });
  });

  describe("lapData()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123,
  custId: 123,
  teamId: 123
      };
      await resultsService.lapData(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/lap_data", { params: testParams });
    });
  });

  describe("searchHosted()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  startRangeBegin: "test",
  startRangeEnd: "test",
  finishRangeBegin: "test",
  finishRangeEnd: "test",
  custId: 123,
  teamId: 123,
  hostCustId: 123,
  sessionName: "test",
  leagueId: 123,
  leagueSeasonId: 123,
  carId: 123,
  trackId: 123,
  categoryIds: [123, 456]
      };
      await resultsService.searchHosted(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/search_hosted", { params: testParams });
    });
  });

  describe("searchSeries()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonYear: 123,
  seasonQuarter: 123,
  startRangeBegin: "test",
  startRangeEnd: "test",
  finishRangeBegin: "test",
  finishRangeEnd: "test",
  custId: 123,
  teamId: 123,
  seriesId: 123,
  raceWeekNum: 123,
  officialOnly: true,
  eventTypes: [123, 456],
  categoryIds: [123, 456]
      };
      await resultsService.searchSeries(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/search_series", { params: testParams });
    });
  });

  describe("seasonResults()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  eventType: 123,
  raceWeekNum: 123
      };
      await resultsService.seasonResults(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/results/season_results", { params: testParams });
    });
  });

});