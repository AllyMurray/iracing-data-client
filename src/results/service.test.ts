import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { ResultsService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import resultsgetSample from "../../samples/results.get.json";
import resultseventlogSample from "../../samples/results.event_log.json";
import resultslapchartdataSample from "../../samples/results.lap_chart_data.json";
import resultslapdataSample from "../../samples/results.lap_data_var3.json";
import resultssearchhostedSample from "../../samples/results.search_hosted.json";
import resultssearchseriesSample from "../../samples/results.search_series.json";
import resultsseasonresultsSample from "../../samples/results.season_results.json";

describe("ResultsService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let resultsService: ResultsService;

  beforeEach(() => {
    mockFetch = vi.fn();

    client = new IRacingClient({
      auth: {
        type: "authorization-code",
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
        tokens: {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        },
      },
      fetchFn: mockFetch as any,
      validateParams: false,
      validateSemanticParams: false,
    });

    resultsService = new ResultsService(client);
  });

  describe("get()", () => {
    it("should fetch and validate results get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultsgetSample)
      });

      const testParams = {
  subsessionId: 123,
  includeLicenses: true
      };
      const result = await resultsService.get(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/results/get"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("eventLog()", () => {
    it("should fetch and validate results eventLog data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultseventlogSample)
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      const result = await resultsService.eventLog(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/results/event_log"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("lapChartData()", () => {
    it("should fetch and validate results lapChartData data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultslapchartdataSample)
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123
      };
      const result = await resultsService.lapChartData(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/results/lap_chart_data"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("lapData()", () => {
    it("should fetch and validate results lapData data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultslapdataSample)
      });

      const testParams = {
  subsessionId: 123,
  simsessionNumber: 123,
  custId: 123,
  teamId: 123
      };
      const result = await resultsService.lapData(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/results/lap_data"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("searchHosted()", () => {
    it("should fetch and validate results searchHosted data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultssearchhostedSample)
      });

      const result = await resultsService.searchHosted();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/results/search_hosted",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("searchSeries()", () => {
    it("should fetch and validate results searchSeries data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultssearchseriesSample)
      });

      const result = await resultsService.searchSeries();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/results/search_series",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("seasonResults()", () => {
    it("should fetch and validate results seasonResults data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(resultsseasonresultsSample)
      });

      const testParams = {
  seasonId: 123,
  eventType: 123,
  raceWeekNum: 123
      };
      const result = await resultsService.seasonResults(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/results/season_results"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

});