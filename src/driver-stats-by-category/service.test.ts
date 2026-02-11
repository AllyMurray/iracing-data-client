import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { DriverStatsByCategoryService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import driverstatsbycategoryovalSample from "../../samples/driver_stats_by_category.oval.json";
import driverstatsbycategorysportscarSample from "../../samples/driver_stats_by_category.sports_car.json";
import driverstatsbycategoryformulacarSample from "../../samples/driver_stats_by_category.formula_car.json";
import driverstatsbycategoryroadSample from "../../samples/driver_stats_by_category.road.json";
import driverstatsbycategorydirtovalSample from "../../samples/driver_stats_by_category.dirt_oval.json";
import driverstatsbycategorydirtroadSample from "../../samples/driver_stats_by_category.dirt_road.json";

describe("DriverStatsByCategoryService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let driverStatsByCategoryService: DriverStatsByCategoryService;

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

    driverStatsByCategoryService = new DriverStatsByCategoryService(client);
  });

  describe("oval()", () => {
    it("should fetch and validate driver_stats_by_category oval data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategoryovalSample)
      });

      const result = await driverStatsByCategoryService.oval();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/oval",
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

  describe("sportsCar()", () => {
    it("should fetch and validate driver_stats_by_category sportsCar data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategorysportscarSample)
      });

      const result = await driverStatsByCategoryService.sportsCar();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/sports_car",
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

  describe("formulaCar()", () => {
    it("should fetch and validate driver_stats_by_category formulaCar data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategoryformulacarSample)
      });

      const result = await driverStatsByCategoryService.formulaCar();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/formula_car",
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

  describe("road()", () => {
    it("should fetch and validate driver_stats_by_category road data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategoryroadSample)
      });

      const result = await driverStatsByCategoryService.road();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/road",
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

  describe("dirtOval()", () => {
    it("should fetch and validate driver_stats_by_category dirtOval data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategorydirtovalSample)
      });

      const result = await driverStatsByCategoryService.dirtOval();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval",
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

  describe("dirtRoad()", () => {
    it("should fetch and validate driver_stats_by_category dirtRoad data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(driverstatsbycategorydirtroadSample)
      });

      const result = await driverStatsByCategoryService.dirtRoad();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road",
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