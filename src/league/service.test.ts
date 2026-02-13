import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { LeagueService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import leaguecustleaguesessionsSample from "../../samples/league.cust_league_sessions.json";
import leaguedirectorySample from "../../samples/league.directory.json";
import leaguegetSample from "../../samples/league.get.json";
import leaguegetpointssystemsSample from "../../samples/league.get_points_systems.json";
import leaguemembershipSample from "../../samples/league.membership.json";
import leaguerosterSample from "../../samples/league.roster.json";
import leagueseasonsSample from "../../samples/league.seasons.json";
import leagueseasonstandingsSample from "../../samples/league.season_standings.json";
import leagueseasonsessionsSample from "../../samples/league.season_sessions.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("LeagueService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let leagueService: LeagueService;

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

    leagueService = new LeagueService(client);
  });

  describe("custLeagueSessions()", () => {
    it("should fetch, transform, and validate league custLeagueSessions data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguecustleaguesessionsSample));

      const testParams = {
  mine: true,
  packageId: 123
      };
      const result = await leagueService.custLeagueSessions(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/cust_league_sessions"),
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
  mine: true,
  packageId: 123
      };
      await expect(leagueService.custLeagueSessions(testParams)).rejects.toThrow();
    });
  });

  describe("directory()", () => {
    it("should fetch, transform, and validate league directory data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguedirectorySample));

      const testParams = {
  search: "test",
  tag: "test",
  restrictToMember: true,
  restrictToRecruiting: true,
  restrictToFriends: true,
  restrictToWatched: true,
  minimumRosterCount: 123,
  maximumRosterCount: 123,
  lowerbound: 123,
  upperbound: 123,
  sort: "test",
  order: "test"
      };
      const result = await leagueService.directory(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/directory"),
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
  search: "test",
  tag: "test",
  restrictToMember: true,
  restrictToRecruiting: true,
  restrictToFriends: true,
  restrictToWatched: true,
  minimumRosterCount: 123,
  maximumRosterCount: 123,
  lowerbound: 123,
  upperbound: 123,
  sort: "test",
  order: "test"
      };
      await expect(leagueService.directory(testParams)).rejects.toThrow();
    });
  });

  describe("get()", () => {
    it("should fetch, transform, and validate league get data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguegetSample));

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.get(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/get"),
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
  leagueId: 123,
  includeLicenses: true
      };
      await expect(leagueService.get(testParams)).rejects.toThrow();
    });
  });

  describe("getPointsSystems()", () => {
    it("should fetch, transform, and validate league getPointsSystems data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguegetpointssystemsSample));

      const testParams = {
  leagueId: 123,
  seasonId: 123
      };
      const result = await leagueService.getPointsSystems(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/get_points_systems"),
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
  leagueId: 123,
  seasonId: 123
      };
      await expect(leagueService.getPointsSystems(testParams)).rejects.toThrow();
    });
  });

  describe("membership()", () => {
    it("should fetch, transform, and validate league membership data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguemembershipSample));

      const testParams = {
  custId: 123,
  includeLeague: true
      };
      const result = await leagueService.membership(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/membership"),
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
  includeLeague: true
      };
      await expect(leagueService.membership(testParams)).rejects.toThrow();
    });
  });

  describe("roster()", () => {
    it("should fetch, transform, and validate league roster data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leaguerosterSample));

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.roster(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/roster"),
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
  leagueId: 123,
  includeLicenses: true
      };
      await expect(leagueService.roster(testParams)).rejects.toThrow();
    });
  });

  describe("seasons()", () => {
    it("should fetch, transform, and validate league seasons data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leagueseasonsSample));

      const testParams = {
  leagueId: 123,
  retired: true
      };
      const result = await leagueService.seasons(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/seasons"),
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
  leagueId: 123,
  retired: true
      };
      await expect(leagueService.seasons(testParams)).rejects.toThrow();
    });
  });

  describe("seasonStandings()", () => {
    it("should fetch, transform, and validate league seasonStandings data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leagueseasonstandingsSample));

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  carClassId: 123,
  carId: 123
      };
      const result = await leagueService.seasonStandings(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/season_standings"),
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
  leagueId: 123,
  seasonId: 123,
  carClassId: 123,
  carId: 123
      };
      await expect(leagueService.seasonStandings(testParams)).rejects.toThrow();
    });
  });

  describe("seasonSessions()", () => {
    it("should fetch, transform, and validate league seasonSessions data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(leagueseasonsessionsSample));

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  resultsOnly: true
      };
      const result = await leagueService.seasonSessions(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/league/season_sessions"),
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
  leagueId: 123,
  seasonId: 123,
  resultsOnly: true
      };
      await expect(leagueService.seasonSessions(testParams)).rejects.toThrow();
    });
  });

});