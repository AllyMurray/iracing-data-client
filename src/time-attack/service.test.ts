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
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    timeAttackService = new TimeAttackService(client);
  });

  describe("memberSeasonResults()", () => {
    it("should fetch, transform, and validate time_attack memberSeasonResults data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
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

      // Verify authentication call
      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/auth",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com", password: "password" })
        })
      );

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/time_attack/member_season_results"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Cookie: expect.stringContaining("irsso_membersv2=cookie123")
          })
        })
      );

      // Verify response structure and transformation
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should handle schema validation errors", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
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