import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { TimeAttackService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import timeattackmemberseasonresultsSample from "../../samples/time_attack.member_season_results.json";

describe("TimeAttackService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let timeAttackService: TimeAttackService;

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

    timeAttackService = new TimeAttackService(client);
  });

  describe("memberSeasonResults()", () => {
    it("should fetch, transform, and validate time_attack memberSeasonResults data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse)
      });

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(timeattackmemberseasonresultsSample)
      });

      const testParams = {
  taCompSeasonId: 123
      };
      const result = await timeAttackService.memberSeasonResults(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/time_attack/member_season_results"),
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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse)
      });

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ invalid: "data" })
      });

      const testParams = {
  taCompSeasonId: 123
      };
      await expect(timeAttackService.memberSeasonResults(testParams)).rejects.toThrow();
    });
  });

});