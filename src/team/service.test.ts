import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { TeamService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import teamgetSample from "../../samples/team.get.json";
import teammembershipSample from "../../samples/team.membership.json";

describe("TeamService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let teamService: TeamService;

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

    teamService = new TeamService(client);
  });

  describe("get()", () => {
    it("should fetch and validate team get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(teamgetSample)
      });

      const testParams = {
  teamId: 123,
  includeLicenses: true
      };
      const result = await teamService.get(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/team/get"),
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
    it("should fetch and validate team membership data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(teammembershipSample)
      });

      const result = await teamService.membership();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/team/membership",
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