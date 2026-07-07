import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { HostedService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import hostedcombinedsessionsSample from "../../samples/hosted.combined_sessions.json";
import hostedsessionsSample from "../../samples/hosted.sessions.json";

describe("HostedService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let hostedService: HostedService;

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

    hostedService = new HostedService(client);
  });

  describe("combinedSessions()", () => {
    it("should fetch and validate hosted combinedSessions data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(hostedcombinedsessionsSample)
      });

      const result = await hostedService.combinedSessions();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/hosted/combined_sessions",
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

  describe("sessions()", () => {
    it("should fetch and validate hosted sessions data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(hostedsessionsSample)
      });

      const result = await hostedService.sessions();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/hosted/sessions",
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