import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { SeriesService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import seriesassetsSample from "../../samples/series.assets.json";
import seriesgetSample from "../../samples/series.get.json";
import seriespastseasonsSample from "../../samples/series.past_seasons.json";
import seriesseasonsSample from "../../samples/series.seasons.json";
import seriesseasonlistSample from "../../samples/series.season_list.json";
import seriesstatsseriesSample from "../../samples/series.stats_series.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("SeriesService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let seriesService: SeriesService;

  // Mock OAuth token response
  const mockTokenResponse = {
    access_token: "test-access-token",
    token_type: "Bearer",
    expires_in: 600,
    refresh_token: "test-refresh-token",
  };

  beforeEach(() => {
    mockFetch = vi.fn();

    client = new IRacingClient({
      auth: {
        type: "password-limited",
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
        username: "test@example.com",
        password: "password",
      },
      fetchFn: mockFetch
    });

    seriesService = new SeriesService(client);
  });

  describe("assets()", () => {
    it("should fetch, transform, and validate series assets data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriesassetsSample));

      const result = await seriesService.assets();

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/assets",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      await expect(seriesService.assets()).rejects.toThrow();
    });
  });

  describe("get()", () => {
    it("should fetch, transform, and validate series get data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriesgetSample));

      const result = await seriesService.get();

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/get",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      await expect(seriesService.get()).rejects.toThrow();
    });
  });

  describe("pastSeasons()", () => {
    it("should fetch, transform, and validate series pastSeasons data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriespastseasonsSample));

      const testParams = {
  seriesId: 123
      };
      const result = await seriesService.pastSeasons(testParams);

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/series/past_seasons"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      const testParams = {
  seriesId: 123
      };
      await expect(seriesService.pastSeasons(testParams)).rejects.toThrow();
    });
  });

  describe("seasons()", () => {
    it("should fetch, transform, and validate series seasons data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriesseasonsSample));

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasons(testParams);

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/series/seasons"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      await expect(seriesService.seasons(testParams)).rejects.toThrow();
    });
  });

  describe("seasonList()", () => {
    it("should fetch, transform, and validate series seasonList data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriesseasonlistSample));

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seriesService.seasonList(testParams);

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/series/season_list"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      const testParams = {
  includeSeries: true,
  seasonYear: 123,
  seasonQuarter: 123
      };
      await expect(seriesService.seasonList(testParams)).rejects.toThrow();
    });
  });

  describe("seasonSchedule()", () => {
    it("should fetch series seasonSchedule data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123
      };
      await seriesService.seasonSchedule(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("statsSeries()", () => {
    it("should fetch, transform, and validate series statsSeries data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seriesstatsseriesSample));

      const result = await seriesService.statsSeries();

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/series/stats_series",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token"
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      await expect(seriesService.statsSeries()).rejects.toThrow();
    });
  });

});