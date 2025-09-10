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
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    lookupService = new LookupService(client);
  });

  describe("countries()", () => {
    it("should fetch, transform, and validate lookup countries data", async () => {
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
        json: () => Promise.resolve(lookupcountriesSample)
      });

      const result = await lookupService.countries();

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
        "https://members-ng.iracing.com/data/lookup/countries",
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

      await expect(lookupService.countries()).rejects.toThrow();
    });
  });

  describe("drivers()", () => {
    it("should fetch, transform, and validate lookup drivers data", async () => {
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
        json: () => Promise.resolve(lookupdriversSample)
      });

      const testParams = {
  searchTerm: "test",
  leagueId: 123
      };
      const result = await lookupService.drivers(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/lookup/drivers"),
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

      const testParams = {
  searchTerm: "test",
  leagueId: 123
      };
      await expect(lookupService.drivers(testParams)).rejects.toThrow();
    });
  });

  describe("flairs()", () => {
    it("should fetch, transform, and validate lookup flairs data", async () => {
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
        json: () => Promise.resolve(lookupflairsSample)
      });

      const result = await lookupService.flairs();

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
        "https://members-ng.iracing.com/data/lookup/flairs",
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

      await expect(lookupService.flairs()).rejects.toThrow();
    });
  });

  describe("get()", () => {
    it("should fetch, transform, and validate lookup get data", async () => {
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
        json: () => Promise.resolve(lookupgetSample)
      });

      const result = await lookupService.get();

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
        "https://members-ng.iracing.com/data/lookup/get",
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

      await expect(lookupService.get()).rejects.toThrow();
    });
  });

  describe("licenses()", () => {
    it("should fetch, transform, and validate lookup licenses data", async () => {
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
        json: () => Promise.resolve(lookuplicensesSample)
      });

      const result = await lookupService.licenses();

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
        "https://members-ng.iracing.com/data/lookup/licenses",
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

      await expect(lookupService.licenses()).rejects.toThrow();
    });
  });

});