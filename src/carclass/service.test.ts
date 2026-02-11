import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { CarclassService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import carclassgetSample from "../../samples/carclass.get.json";

describe("CarclassService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let carclassService: CarclassService;

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

    carclassService = new CarclassService(client);
  });

  describe("get()", () => {
    it("should fetch and validate carclass get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(carclassgetSample)
      });

      const result = await carclassService.get();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/carclass/get",
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