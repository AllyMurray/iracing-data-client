import { describe, it, expect, vi, beforeEach } from "vitest";
import { LeagueService } from "./service";
import type { IRacingClient } from "../client";
import type { LeagueCustLeagueSessionsResponse, LeagueDirectoryResponse, LeagueGetResponse, LeagueGetPointsSystemsResponse, LeagueMembershipResponse, LeagueRosterResponse, LeagueSeasonsResponse, LeagueSeasonStandingsResponse, LeagueSeasonSessionsResponse } from "./types";
import { LeagueCustLeagueSessionsSchema, LeagueDirectorySchema, LeagueGetSchema, LeagueGetPointsSystemsSchema, LeagueMembershipSchema, LeagueRosterSchema, LeagueSeasonsSchema, LeagueSeasonStandingsSchema, LeagueSeasonSessionsSchema } from "./types";

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
  let mockClient: IRacingClient;
  let leagueService: LeagueService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    leagueService = new LeagueService(mockClient);
  });

  describe("custLeagueSessions()", () => {
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

      const expectedTransformedData = transformData(leaguecustleaguesessionsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  mine: true,
  packageId: 123
      };
      const result = await leagueService.custLeagueSessions(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/cust_league_sessions", { params: testParams, schema: LeagueCustLeagueSessionsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueCustLeagueSessionsResponse type structure", async () => {
      const mockData = {} as LeagueCustLeagueSessionsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  mine: true,
  packageId: 123
      };
      const result = await leagueService.custLeagueSessions(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("directory()", () => {
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

      const expectedTransformedData = transformData(leaguedirectorySample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

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
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/directory", { params: testParams, schema: LeagueDirectorySchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueDirectoryResponse type structure", async () => {
      const mockData = {} as LeagueDirectoryResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

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

      const expectedTransformedData = transformData(leaguegetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.get(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/get", { params: testParams, schema: LeagueGetSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueGetResponse type structure", async () => {
      const mockData = {} as LeagueGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.get(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("getPointsSystems()", () => {
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

      const expectedTransformedData = transformData(leaguegetpointssystemsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  seasonId: 123
      };
      const result = await leagueService.getPointsSystems(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/get_points_systems", { params: testParams, schema: LeagueGetPointsSystemsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueGetPointsSystemsResponse type structure", async () => {
      const mockData = {} as LeagueGetPointsSystemsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  seasonId: 123
      };
      const result = await leagueService.getPointsSystems(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("membership()", () => {
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

      const expectedTransformedData = transformData(leaguemembershipSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123,
  includeLeague: true
      };
      const result = await leagueService.membership(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/membership", { params: testParams, schema: LeagueMembershipSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueMembershipResponse type structure", async () => {
      const mockData = {} as LeagueMembershipResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123,
  includeLeague: true
      };
      const result = await leagueService.membership(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("roster()", () => {
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

      const expectedTransformedData = transformData(leaguerosterSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.roster(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/roster", { params: testParams, schema: LeagueRosterSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueRosterResponse type structure", async () => {
      const mockData = {} as LeagueRosterResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  includeLicenses: true
      };
      const result = await leagueService.roster(testParams);
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

      const expectedTransformedData = transformData(leagueseasonsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  retired: true
      };
      const result = await leagueService.seasons(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/seasons", { params: testParams, schema: LeagueSeasonsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueSeasonsResponse type structure", async () => {
      const mockData = {} as LeagueSeasonsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  retired: true
      };
      const result = await leagueService.seasons(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasonStandings()", () => {
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

      const expectedTransformedData = transformData(leagueseasonstandingsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  carClassId: 123,
  carId: 123
      };
      const result = await leagueService.seasonStandings(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/season_standings", { params: testParams, schema: LeagueSeasonStandingsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueSeasonStandingsResponse type structure", async () => {
      const mockData = {} as LeagueSeasonStandingsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  carClassId: 123,
  carId: 123
      };
      const result = await leagueService.seasonStandings(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasonSessions()", () => {
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

      const expectedTransformedData = transformData(leagueseasonsessionsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  resultsOnly: true
      };
      const result = await leagueService.seasonSessions(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/league/season_sessions", { params: testParams, schema: LeagueSeasonSessionsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching LeagueSeasonSessionsResponse type structure", async () => {
      const mockData = {} as LeagueSeasonSessionsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  leagueId: 123,
  seasonId: 123,
  resultsOnly: true
      };
      const result = await leagueService.seasonSessions(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});