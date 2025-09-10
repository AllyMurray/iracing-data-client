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
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    constantsService = new ConstantsService(client);
  });

  describe("categories()", () => {
    it("should fetch, transform, and validate constants categories data", async () => {
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
        json: () => Promise.resolve(constantscategoriesSample)
      });

      const result = await constantsService.categories();

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
        "https://members-ng.iracing.com/data/constants/categories",
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

      await expect(constantsService.categories()).rejects.toThrow();
    });
  });

  describe("divisions()", () => {
    it("should fetch, transform, and validate constants divisions data", async () => {
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
        json: () => Promise.resolve(constantsdivisionsSample)
      });

      const result = await constantsService.divisions();

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
        "https://members-ng.iracing.com/data/constants/divisions",
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

      await expect(constantsService.divisions()).rejects.toThrow();
    });
  });

  describe("eventTypes()", () => {
    it("should fetch, transform, and validate constants eventTypes data", async () => {
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
        json: () => Promise.resolve(constantseventtypesSample)
      });

      const result = await constantsService.eventTypes();

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
        "https://members-ng.iracing.com/data/constants/event_types",
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

      await expect(constantsService.eventTypes()).rejects.toThrow();
    });
  });

});