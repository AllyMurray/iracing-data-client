import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { TimeAttackService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import timeattackmemberseasonresultsSample from "../../samples/time_attack.member_season_results.json";

describe("TimeAttackService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let timeAttackService: TimeAttackService;

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

    timeAttackService = new TimeAttackService(client);
  });

  describe("memberSeasonResults()", () => {
    it("should fetch and validate time_attack memberSeasonResults data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(timeattackmemberseasonresultsSample)
      });

      const testParams = {
  taCompSeasonId: 123
      };
      const result = await timeAttackService.memberSeasonResults(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/time_attack/member_season_results"),
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