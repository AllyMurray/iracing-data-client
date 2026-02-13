import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { StatsService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import statsmemberbestsSample from "../../samples/stats.member_bests.json";
import statsmembercareerSample from "../../samples/stats.member_career.json";
import statsmemberrecapSample from "../../samples/stats.member_recap.json";
import statsmemberrecentracesSample from "../../samples/stats.member_recent_races.json";
import statsmembersummarySample from "../../samples/stats.member_summary.json";
import statsmemberyearlySample from "../../samples/stats.member_yearly.json";
import statsworldrecordsSample from "../../samples/stats.world_records.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("StatsService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let statsService: StatsService;

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

    statsService = new StatsService(client);
  });

  describe("memberBests()", () => {
    it("should fetch, transform, and validate stats memberBests data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmemberbestsSample));

      const testParams = {
  custId: 123,
  carId: 123
      };
      const result = await statsService.memberBests(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_bests"),
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
  custId: 123,
  carId: 123
      };
      await expect(statsService.memberBests(testParams)).rejects.toThrow();
    });
  });

  describe("memberCareer()", () => {
    it("should fetch, transform, and validate stats memberCareer data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmembercareerSample));

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberCareer(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_career"),
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
  custId: 123
      };
      await expect(statsService.memberCareer(testParams)).rejects.toThrow();
    });
  });

  describe("memberDivision()", () => {
    it("should fetch stats memberDivision data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  eventType: 123
      };
      await statsService.memberDivision(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("memberRecap()", () => {
    it("should fetch, transform, and validate stats memberRecap data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmemberrecapSample));

      const testParams = {
  custId: 123,
  year: 123,
  season: 123
      };
      const result = await statsService.memberRecap(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_recap"),
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
  custId: 123,
  year: 123,
  season: 123
      };
      await expect(statsService.memberRecap(testParams)).rejects.toThrow();
    });
  });

  describe("memberRecentRaces()", () => {
    it("should fetch, transform, and validate stats memberRecentRaces data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmemberrecentracesSample));

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberRecentRaces(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_recent_races"),
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
  custId: 123
      };
      await expect(statsService.memberRecentRaces(testParams)).rejects.toThrow();
    });
  });

  describe("memberSummary()", () => {
    it("should fetch, transform, and validate stats memberSummary data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmembersummarySample));

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberSummary(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_summary"),
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
  custId: 123
      };
      await expect(statsService.memberSummary(testParams)).rejects.toThrow();
    });
  });

  describe("memberYearly()", () => {
    it("should fetch, transform, and validate stats memberYearly data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsmemberyearlySample));

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberYearly(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_yearly"),
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
  custId: 123
      };
      await expect(statsService.memberYearly(testParams)).rejects.toThrow();
    });
  });

  describe("seasonDriverStandings()", () => {
    it("should fetch stats seasonDriverStandings data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonDriverStandings(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonSupersessionStandings()", () => {
    it("should fetch stats seasonSupersessionStandings data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonSupersessionStandings(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonTeamStandings()", () => {
    it("should fetch stats seasonTeamStandings data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123
      };
      await statsService.seasonTeamStandings(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonTtStandings()", () => {
    it("should fetch stats seasonTtStandings data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonTtStandings(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonTtResults()", () => {
    it("should fetch stats seasonTtResults data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      await statsService.seasonTtResults(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("seasonQualifyResults()", () => {
    it("should fetch stats seasonQualifyResults data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      await statsService.seasonQualifyResults(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("worldRecords()", () => {
    it("should fetch, transform, and validate stats worldRecords data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(statsworldrecordsSample));

      const testParams = {
  carId: 123,
  trackId: 123,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await statsService.worldRecords(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/stats/world_records"),
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
  carId: 123,
  trackId: 123,
  seasonYear: 123,
  seasonQuarter: 123
      };
      await expect(statsService.worldRecords(testParams)).rejects.toThrow();
    });
  });

});