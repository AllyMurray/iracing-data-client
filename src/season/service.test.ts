import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { SeasonService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import seasonlistSample from "../../samples/season.list.json";
import seasonraceguideSample from "../../samples/season.race_guide.json";
import seasonspectatorsubsessionidsSample from "../../samples/season.spectator_subsessionids.json";
import seasonspectatorsubsessionidsdetailSample from "../../samples/season.spectator_subsessionids_detail.json";

describe("SeasonService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let seasonService: SeasonService;

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

    seasonService = new SeasonService(client);
  });

  describe("list()", () => {
    it("should fetch and validate season list data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seasonlistSample)
      });

      const testParams = {
  seasonYear: 123,
  seasonQuarter: 123
      };
      const result = await seasonService.list(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/season/list"),
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

  describe("raceGuide()", () => {
    it("should fetch and validate season raceGuide data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seasonraceguideSample)
      });

      const result = await seasonService.raceGuide();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/season/race_guide",
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

  describe("spectatorSubsessionids()", () => {
    it("should fetch and validate season spectatorSubsessionids data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seasonspectatorsubsessionidsSample)
      });

      const result = await seasonService.spectatorSubsessionids();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/season/spectator_subsessionids",
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

  describe("spectatorSubsessionidsDetail()", () => {
    it("should fetch and validate season spectatorSubsessionidsDetail data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(seasonspectatorsubsessionidsdetailSample)
      });

      const result = await seasonService.spectatorSubsessionidsDetail();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/season/spectator_subsessionids_detail",
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