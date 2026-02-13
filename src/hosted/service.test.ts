import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { HostedService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import hostedcombinedsessionsSample from "../../samples/hosted.combined_sessions.json";
import hostedsessionsSample from "../../samples/hosted.sessions.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("HostedService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let hostedService: HostedService;

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

    hostedService = new HostedService(client);
  });

  describe("combinedSessions()", () => {
    it("should fetch, transform, and validate hosted combinedSessions data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(hostedcombinedsessionsSample));

      const testParams = {
  packageId: 123
      };
      const result = await hostedService.combinedSessions(testParams);

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call with Bearer token
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/hosted/combined_sessions"),
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

      const testParams = {
  packageId: 123
      };
      await expect(hostedService.combinedSessions(testParams)).rejects.toThrow();
    });
  });

  describe("sessions()", () => {
    it("should fetch, transform, and validate hosted sessions data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(hostedsessionsSample));

      const result = await hostedService.sessions();

      // Verify OAuth token request
      expect(mockFetch).toHaveBeenCalledWith(
        "https://oauth.iracing.com/oauth2/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify API call with Bearer token
      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/hosted/sessions",
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

      await expect(hostedService.sessions()).rejects.toThrow();
    });
  });

});