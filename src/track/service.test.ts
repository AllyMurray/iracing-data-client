import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { TrackService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import trackassetsSample from "../../samples/track.assets.json";
import trackgetSample from "../../samples/track.get.json";

describe("TrackService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let trackService: TrackService;

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

    trackService = new TrackService(client);
  });

  describe("assets()", () => {
    it("should fetch and validate track assets data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(trackassetsSample)
      });

      const result = await trackService.assets();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/track/assets",
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

  describe("get()", () => {
    it("should fetch and validate track get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(trackgetSample)
      });

      const result = await trackService.get();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/track/get",
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