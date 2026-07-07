import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
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

describe("LeagueService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let leagueService: LeagueService;

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

    leagueService = new LeagueService(client);
  });

  describe("custLeagueSessions()", () => {
    it("should fetch and validate league custLeagueSessions data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguecustleaguesessionsSample)
      });

      const result = await leagueService.custLeagueSessions();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/league/cust_league_sessions",
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

  describe("directory()", () => {
    it("should fetch and validate league directory data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguedirectorySample)
      });

      const result = await leagueService.directory();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/league/directory",
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
    it("should fetch and validate league get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguegetSample)
      });

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.get(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/get"),
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

  describe("getPointsSystems()", () => {
    it("should fetch and validate league getPointsSystems data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguegetpointssystemsSample)
      });

      const testParams = {
  leagueId: 123,
  seasonId: 123
      };
      const result = await leagueService.getPointsSystems(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/get_points_systems"),
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

  describe("membership()", () => {
    it("should fetch and validate league membership data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguemembershipSample)
      });

      const result = await leagueService.membership();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/league/membership",
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

  describe("roster()", () => {
    it("should fetch and validate league roster data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leaguerosterSample)
      });

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.roster(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/roster"),
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
    it("should fetch and validate league seasons data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leagueseasonsSample)
      });

      const testParams = {
  leagueId: 123,
  retired: true
      };
      const result = await leagueService.seasons(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/seasons"),
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

  describe("seasonStandings()", () => {
    it("should fetch and validate league seasonStandings data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leagueseasonstandingsSample)
      });

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  carClassId: 123,
  carId: 123
      };
      const result = await leagueService.seasonStandings(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/season_standings"),
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

  describe("seasonSessions()", () => {
    it("should fetch and validate league seasonSessions data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(leagueseasonsessionsSample)
      });

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  resultsOnly: true
      };
      const result = await leagueService.seasonSessions(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/league/season_sessions"),
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