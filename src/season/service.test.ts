import { type FetchLike } from "../auth/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { SeasonService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import seasonlistSample from "../../samples/season.list.json";
import seasonraceguideSample from "../../samples/season.race_guide.json";
import seasonspectatorsubsessionidsSample from "../../samples/season.spectator_subsessionids.json";
import seasonspectatorsubsessionidsdetailSample from "../../samples/season.spectator_subsessionids_detail.json";
import { createMockResponse } from "../__tests__/test-utils";

describe("SeasonService", () => {
  let mockFetch: Mock<FetchLike>;
  let client: IRacingClient;
  let seasonService: SeasonService;

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

    seasonService = new SeasonService(client);
  });

  describe("list()", () => {
    it("should fetch, transform, and validate season list data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seasonlistSample));

      const testParams = {
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seasonService.list(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/season/list"),
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
  seasonYear: 123,
  seasonQuarter: 123
      };
      await expect(seasonService.list(testParams)).rejects.toThrow();
    });
  });

  describe("raceGuide()", () => {
    it("should fetch, transform, and validate season raceGuide data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seasonraceguideSample));

      const testParams = {
  from: "test",
  includeEndAfterFrom: true
      };
      const result = await seasonService.raceGuide(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/season/race_guide"),
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
  from: "test",
  includeEndAfterFrom: true
      };
      await expect(seasonService.raceGuide(testParams)).rejects.toThrow();
    });
  });

  describe("spectatorSubsessionids()", () => {
    it("should fetch, transform, and validate season spectatorSubsessionids data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seasonspectatorsubsessionidsSample));

      const testParams = {
  eventTypes: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionids(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/season/spectator_subsessionids"),
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
  eventTypes: [123, 456]
      };
      await expect(seasonService.spectatorSubsessionids(testParams)).rejects.toThrow();
    });
  });

  describe("spectatorSubsessionidsDetail()", () => {
    it("should fetch, transform, and validate season spectatorSubsessionidsDetail data", async () => {
      // Mock OAuth token response
      mockFetch.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      // Mock API response with original snake_case format
      mockFetch.mockResolvedValueOnce(createMockResponse(seasonspectatorsubsessionidsdetailSample));

      const testParams = {
  eventTypes: [123, 456],
  seasonIds: [123, 456]
      };
      const result = await seasonService.spectatorSubsessionidsDetail(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail"),
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
  eventTypes: [123, 456],
  seasonIds: [123, 456]
      };
      await expect(seasonService.spectatorSubsessionidsDetail(testParams)).rejects.toThrow();
    });
  });

});