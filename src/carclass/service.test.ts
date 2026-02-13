import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { CarclassService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import carclassgetSample from "../../samples/carclass.get.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("CarclassService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let carclassService: CarclassService;

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

    carclassService = new CarclassService(client);
  });

  describe("get()", () => {
    it("should fetch, transform, and validate carclass get data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(carclassgetSample));

      const result = await carclassService.get();

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
        "https://members-ng.iracing.com/data/carclass/get",
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

      await expect(carclassService.get()).rejects.toThrow();
    });
  });

});