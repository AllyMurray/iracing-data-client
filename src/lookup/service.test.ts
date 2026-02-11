import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { LookupService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import lookupcountriesSample from "../../samples/lookup.countries.json";
import lookupdriversSample from "../../samples/lookup.drivers.json";
import lookupflairsSample from "../../samples/lookup.flairs.json";
import lookupgetSample from "../../samples/lookup.get.json";
import lookuplicensesSample from "../../samples/lookup.licenses.json";

describe("LookupService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let lookupService: LookupService;

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

    lookupService = new LookupService(client);
  });

  describe("countries()", () => {
    it("should fetch and validate lookup countries data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(lookupcountriesSample)
      });

      const result = await lookupService.countries();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/lookup/countries",
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

  describe("drivers()", () => {
    it("should fetch and validate lookup drivers data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(lookupdriversSample)
      });

      const testParams = {
  searchTerm: "test",
  leagueId: 123
      };
      const result = await lookupService.drivers(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/lookup/drivers"),
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

  describe("flairs()", () => {
    it("should fetch and validate lookup flairs data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(lookupflairsSample)
      });

      const result = await lookupService.flairs();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/lookup/flairs",
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
    it("should fetch and validate lookup get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(lookupgetSample)
      });

      const result = await lookupService.get();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/lookup/get",
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

  describe("licenses()", () => {
    it("should fetch and validate lookup licenses data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(lookuplicensesSample)
      });

      const result = await lookupService.licenses();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/lookup/licenses",
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