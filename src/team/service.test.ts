import { describe, it, expect, vi, beforeEach } from "vitest";
import { TeamService } from "./service";
import type { IRacingClient } from "../client";
import type { TeamMembershipResponse } from "./types";
import { TeamMembership } from "./types";

// Import sample data
import teammembershipSample from "../../samples/team.membership.json";

describe("TeamService", () => {
  let mockClient: IRacingClient;
  let teamService: TeamService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    teamService = new TeamService(mockClient);
  });

  describe("get()", () => {
    it("should call client.get with correct URL", async () => {
      const mockData = {}; // Add mock response data
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  teamId: 123,
  includeLicenses: true
      };
      await teamService.get(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/team/get", { params: testParams });
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

      const expectedTransformedData = transformData(teammembershipSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await teamService.membership();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/team/membership", { schema: TeamMembership });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching TeamMembershipResponse type structure", async () => {
      const mockData = {} as TeamMembershipResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await teamService.membership();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});