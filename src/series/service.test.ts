import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { SeriesService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import seriesassetsSample from "../../samples/series.assets.json";
import seriesgetSample from "../../samples/series.get.json";
import seriespastseasonsSample from "../../samples/series.past_seasons.json";
import seriesseasonsSample from "../../samples/series.seasons.json";
import seriesseasonlistSample from "../../samples/series.season_list.json";
import seriesseasonscheduleSample from "../../samples/series.season_schedule.json";
import seriesstatsseriesSample from "../../samples/series.stats_series.json";

describe("SeriesService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let seriesService: SeriesService;

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

    seriesService = new SeriesService(client);
  });

  describe("assets()", () => {
    it("should fetch and validate series assets data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesassetsSample)
      });

      const result = await seriesService.assets();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/assets",
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

  describe("get()", () => {
    it("should fetch and validate series get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesgetSample)
      });

      const result = await seriesService.get();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/get",
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

  describe("pastSeasons()", () => {
    it("should fetch and validate series pastSeasons data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriespastseasonsSample)
      });

      const testParams = {
  seriesId: 123
      };
      const result = await seriesService.pastSeasons(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/series/past_seasons"),
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

  describe("seasons()", () => {
    it("should fetch and validate series seasons data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesseasonsSample)
      });

      const result = await seriesService.seasons();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/seasons",
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

  describe("seasonList()", () => {
    it("should fetch and validate series seasonList data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesseasonlistSample)
      });

      const result = await seriesService.seasonList();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/season_list",
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

  describe("seasonSchedule()", () => {
    it("should fetch and validate series seasonSchedule data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesseasonscheduleSample)
      });

      const testParams = {
  seasonId: 123
      };
      const result = await seriesService.seasonSchedule(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/series/season_schedule"),
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

  describe("statsSeries()", () => {
    it("should fetch and validate series statsSeries data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seriesstatsseriesSample)
      });

      const result = await seriesService.statsSeries();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/stats_series",
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