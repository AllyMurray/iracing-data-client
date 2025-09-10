import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { TeamService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import teammembershipSample from "../../samples/team.membership.json";

describe("TeamService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let teamService: TeamService;

  beforeEach(() => {
    mockFetch = vi.fn();
    
    client = new IRacingClient({
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    teamService = new TeamService(client);
  });

  describe("get()", () => {
    it("should fetch team get data", async () => {
      // Mock auth response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authcode: "test123",
          ssoCookieValue: "cookie123",
          email: "test@example.com"
        })
      });

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({})
      });

      const testParams = {
  teamId: 123,
  includeLicenses: true
      };
      await teamService.get(testParams);
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("membership()", () => {
    it("should fetch, transform, and validate team membership data", async () => {
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
        json: () => Promise.resolve(teammembershipSample)
      });

      const result = await teamService.membership();

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
        "https://members-ng.iracing.com/data/team/membership",
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

      await expect(teamService.membership()).rejects.toThrow();
    });
  });

});