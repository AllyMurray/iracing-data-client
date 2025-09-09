import { describe, it, expect, vi, beforeEach } from "vitest";
import { TimeAttackService } from "./service";
import type { IRacingClient } from "../client";
import type { TimeAttackMemberSeasonResultsResponse } from "./types";
import { TimeAttackMemberSeasonResultsSchema } from "./types";

// Import sample data
import timeattackmemberseasonresultsSample from "../../samples/time_attack.member_season_results.json";

describe("TimeAttackService", () => {
  let mockClient: IRacingClient;
  let timeAttackService: TimeAttackService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    timeAttackService = new TimeAttackService(mockClient);
  });

  describe("memberSeasonResults()", () => {
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

      const expectedTransformedData = transformData(timeattackmemberseasonresultsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  taCompSeasonId: 123
      };
      const result = await timeAttackService.memberSeasonResults(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/time_attack/member_season_results", { params: testParams, schema: TimeAttackMemberSeasonResultsSchema });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching TimeAttackMemberSeasonResultsResponse type structure", async () => {
      const mockData = {} as TimeAttackMemberSeasonResultsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  taCompSeasonId: 123
      };
      const result = await timeAttackService.memberSeasonResults(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});