import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatsService } from "./service";
import type { IRacingClient } from "../client";
import type { StatsMemberBestsResponse, StatsMemberCareerResponse, StatsMemberRecapResponse, StatsMemberRecentRacesResponse, StatsMemberSummaryResponse, StatsMemberYearlyResponse, StatsWorldRecordsResponse } from "./types";
import { StatsMemberBestsSchema, StatsMemberCareerSchema, StatsMemberRecapSchema, StatsMemberRecentRacesSchema, StatsMemberSummarySchema, StatsMemberYearlySchema, StatsWorldRecordsSchema } from "./types";

// Import sample data
import statsmemberbestsSample from "../../samples/stats.member_bests.json";
import statsmembercareerSample from "../../samples/stats.member_career.json";
import statsmemberrecapSample from "../../samples/stats.member_recap.json";
import statsmemberrecentracesSample from "../../samples/stats.member_recent_races.json";
import statsmembersummarySample from "../../samples/stats.member_summary.json";
import statsmemberyearlySample from "../../samples/stats.member_yearly.json";
import statsworldrecordsSample from "../../samples/stats.world_records.json";

describe("StatsService", () => {
  let mockClient: IRacingClient;
  let statsService: StatsService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    statsService = new StatsService(mockClient);
  });

  describe("memberBests()", () => {
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

      const expectedTransformedData = transformData(statsmemberbestsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123,
  carId: 123
      };
      const result = await statsService.memberBests(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_bests", { params: testParams, schema: StatsMemberBestsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberBestsResponse type structure", async () => {
      const mockData = {} as StatsMemberBestsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123,
  carId: 123
      };
      const result = await statsService.memberBests(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("memberCareer()", () => {
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

      const expectedTransformedData = transformData(statsmembercareerSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberCareer(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_career", { params: testParams, schema: StatsMemberCareerSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberCareerResponse type structure", async () => {
      const mockData = {} as StatsMemberCareerResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberCareer(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("memberDivision()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  eventType: 123
      };
      await statsService.memberDivision(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_division", { params: testParams });
    });
  });

  describe("memberRecap()", () => {
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

      const expectedTransformedData = transformData(statsmemberrecapSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123,
  year: 123,
  season: 123
      };
      const result = await statsService.memberRecap(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_recap", { params: testParams, schema: StatsMemberRecapSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberRecapResponse type structure", async () => {
      const mockData = {} as StatsMemberRecapResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123,
  year: 123,
  season: 123
      };
      const result = await statsService.memberRecap(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("memberRecentRaces()", () => {
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

      const expectedTransformedData = transformData(statsmemberrecentracesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberRecentRaces(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_recent_races", { params: testParams, schema: StatsMemberRecentRacesSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberRecentRacesResponse type structure", async () => {
      const mockData = {} as StatsMemberRecentRacesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberRecentRaces(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("memberSummary()", () => {
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

      const expectedTransformedData = transformData(statsmembersummarySample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberSummary(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_summary", { params: testParams, schema: StatsMemberSummarySchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberSummaryResponse type structure", async () => {
      const mockData = {} as StatsMemberSummaryResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberSummary(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("memberYearly()", () => {
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

      const expectedTransformedData = transformData(statsmemberyearlySample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberYearly(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/member_yearly", { params: testParams, schema: StatsMemberYearlySchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsMemberYearlyResponse type structure", async () => {
      const mockData = {} as StatsMemberYearlyResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await statsService.memberYearly(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("seasonDriverStandings()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonDriverStandings(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_driver_standings", { params: testParams });
    });
  });

  describe("seasonSupersessionStandings()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonSupersessionStandings(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_supersession_standings", { params: testParams });
    });
  });

  describe("seasonTeamStandings()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123
      };
      await statsService.seasonTeamStandings(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_team_standings", { params: testParams });
    });
  });

  describe("seasonTtStandings()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  division: 123,
  raceWeekNum: 123
      };
      await statsService.seasonTtStandings(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_tt_standings", { params: testParams });
    });
  });

  describe("seasonTtResults()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      await statsService.seasonTtResults(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_tt_results", { params: testParams });
    });
  });

  describe("seasonQualifyResults()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  seasonId: 123,
  carClassId: 123,
  raceWeekNum: 123,
  division: 123
      };
      await statsService.seasonQualifyResults(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/season_qualify_results", { params: testParams });
    });
  });

  describe("worldRecords()", () => {
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

      const expectedTransformedData = transformData(statsworldrecordsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  carId: 123,
  trackId: 123,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await statsService.worldRecords(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/stats/world_records", { params: testParams, schema: StatsWorldRecordsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching StatsWorldRecordsResponse type structure", async () => {
      const mockData = {} as StatsWorldRecordsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  carId: 123,
  trackId: 123,
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await statsService.worldRecords(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});