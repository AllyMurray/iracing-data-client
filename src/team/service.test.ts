import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { TeamService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import teammembershipSample from "../../samples/team.membership.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("TeamService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let teamService: TeamService;

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

    teamService = new TeamService(client);
  });

  describe("get()", () => {
    it("should fetch team get data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

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
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(teammembershipSample));

      const result = await teamService.membership();

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
        "https://members-ng.iracing.com/data/team/membership",
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
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock invalid API response
      mockFetch.mockResolvedValueOnce(createMockResponse({ invalid: "data" }));

      await expect(teamService.membership()).rejects.toThrow();
    });
  });

});