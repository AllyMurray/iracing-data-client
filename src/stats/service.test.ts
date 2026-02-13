import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { StatsService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import statsmemberbestsSample from "../../samples/stats.member_bests.json";
import statsmembercareerSample from "../../samples/stats.member_career.json";
import statsmemberdivisionSample from "../../samples/stats.member_division.json";
import statsmemberrecapSample from "../../samples/stats.member_recap.json";
import statsmemberrecentracesSample from "../../samples/stats.member_recent_races.json";
import statsmembersummarySample from "../../samples/stats.member_summary.json";
import statsmemberyearlySample from "../../samples/stats.member_yearly.json";
import statsseasondriverstandingsSample from "../../samples/stats.season_driver_standings.json";
import statsseasonsupersessionstandingsSample from "../../samples/stats.season_supersession_standings.json";
import statsseasonteamstandingsSample from "../../samples/stats.season_team_standings.json";
import statsseasonttstandingsSample from "../../samples/stats.season_tt_standings.json";
import statsseasonttresultsSample from "../../samples/stats.season_tt_results.json";
import statsseasonqualifyresultsSample from "../../samples/stats.season_qualify_results.json";
import statsworldrecordsSample from "../../samples/stats.world_records.json";

describe("StatsService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let statsService: StatsService;

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

    statsService = new StatsService(client);
  });

  describe("memberBests()", () => {
    it("should fetch and validate stats memberBests data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmemberbestsSample)
      });

      const testParams = {
  custId: 123,
  carId: 123
      };
      const result = await statsService.memberBests(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_bests"),
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

  describe("memberCareer()", () => {
    it("should fetch and validate stats memberCareer data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmembercareerSample)
      });

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberCareer(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_career"),
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

  describe("memberDivision()", () => {
    it("should fetch and validate stats memberDivision data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmemberdivisionSample)
      });

      const testParams = {
  seasonId: 123,
  eventType: 123
      };
      const result = await statsService.memberDivision(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_division"),
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

  describe("memberRecap()", () => {
    it("should fetch and validate stats memberRecap data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmemberrecapSample)
      });

      const testParams = {
  custId: 123,
  year: 123,
  season: 123
      };
      const result = await statsService.memberRecap(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_recap"),
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

  describe("memberRecentRaces()", () => {
    it("should fetch and validate stats memberRecentRaces data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmemberrecentracesSample)
      });

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberRecentRaces(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_recent_races"),
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

  describe("memberSummary()", () => {
    it("should fetch and validate stats memberSummary data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmembersummarySample)
      });

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberSummary(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_summary"),
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

  describe("memberYearly()", () => {
    it("should fetch and validate stats memberYearly data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsmemberyearlySample)
      });

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberYearly(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/member_yearly"),
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

  describe("seasonDriverStandings()", () => {
    it("should fetch and validate stats seasonDriverStandings data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasondriverstandingsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      const result = await statsService.seasonDriverStandings(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_driver_standings"),
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

  describe("seasonSupersessionStandings()", () => {
    it("should fetch and validate stats seasonSupersessionStandings data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasonsupersessionstandingsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      const result = await statsService.seasonSupersessionStandings(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_supersession_standings"),
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

  describe("seasonTeamStandings()", () => {
    it("should fetch and validate stats seasonTeamStandings data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasonteamstandingsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123
      };
      const result = await statsService.seasonTeamStandings(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_team_standings"),
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

  describe("seasonTtStandings()", () => {
    it("should fetch and validate stats seasonTtStandings data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasonttstandingsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      const result = await statsService.seasonTtStandings(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_tt_standings"),
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

  describe("seasonTtResults()", () => {
    it("should fetch and validate stats seasonTtResults data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasonttresultsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      const result = await statsService.seasonTtResults(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_tt_results"),
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

  describe("seasonQualifyResults()", () => {
    it("should fetch and validate stats seasonQualifyResults data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsseasonqualifyresultsSample)
      });

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      const result = await statsService.seasonQualifyResults(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/season_qualify_results"),
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

  describe("worldRecords()", () => {
    it("should fetch and validate stats worldRecords data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(statsworldrecordsSample)
      });

      const testParams = {
  carId: 123,
  trackId: 123,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await statsService.worldRecords(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/stats/world_records"),
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