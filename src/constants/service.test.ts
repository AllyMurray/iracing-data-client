import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { ConstantsService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import constantscategoriesSample from "../../samples/constants.categories.json";
import constantsdivisionsSample from "../../samples/constants.divisions.json";
import constantseventtypesSample from "../../samples/constants.event_types.json";

describe("ConstantsService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let constantsService: ConstantsService;

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

    constantsService = new ConstantsService(client);
  });

  describe("categories()", () => {
    it("should fetch and validate constants categories data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(constantscategoriesSample)
      });

      const result = await constantsService.categories();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/constants/categories",
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

  describe("divisions()", () => {
    it("should fetch and validate constants divisions data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(constantsdivisionsSample)
      });

      const result = await constantsService.divisions();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/constants/divisions",
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

  describe("eventTypes()", () => {
    it("should fetch and validate constants eventTypes data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(constantseventtypesSample)
      });

      const result = await constantsService.eventTypes();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/constants/event_types",
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