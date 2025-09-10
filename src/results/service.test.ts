import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { ResultsService } from "./service";
import { IRacingClient } from "../client";

describe("ResultsService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let resultsService: ResultsService;

  beforeEach(() => {
    mockFetch = vi.fn();
    
    client = new IRacingClient({
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    resultsService = new ResultsService(client);
  });

  describe("get()", () => {
    it("should fetch results get data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  subsessionId: 123,
  includeLicenses: true
      };
      await resultsService.get(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("eventLog()", () => {
    it("should fetch results eventLog data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      await resultsService.eventLog(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("lapChartData()", () => {
    it("should fetch results lapChartData data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      await resultsService.lapChartData(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("lapData()", () => {
    it("should fetch results lapData data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123,
  custId: 123,
  teamId: 123
      };
      await resultsService.lapData(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("searchHosted()", () => {
    it("should fetch results searchHosted data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

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
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("searchSeries()", () => {
    it("should fetch results searchSeries data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

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
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonResults()", () => {
    it("should fetch results seasonResults data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  seasonId: 123,
  eventType: 123,
  raceWeekNum: 123
      };
      await resultsService.seasonResults(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

});