import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { MemberService } from "./service";
import { IRacingClient } from "../client";

// Import sample data
import memberawardsSample from "../../samples/member.awards.json";
import memberawardinstancesSample from "../../samples/member.award_instances.json";
import memberchartdataSample from "../../samples/member.chart_data.json";
import membergetSample from "../../samples/member.get.json";
import memberinfoSample from "../../samples/member.info.json";
import memberparticipationcreditsSample from "../../samples/member.participation_credits.json";
import memberprofileSample from "../../samples/member.profile.json";

describe("MemberService", () => {
  let mockFetch: MockInstance;
  let client: IRacingClient;
  let memberService: MemberService;

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

    memberService = new MemberService(client);
  });

  describe("awards()", () => {
    it("should fetch and validate member awards data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberawardsSample)
      });

      const result = await memberService.awards();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/member/awards",
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

  describe("awardInstances()", () => {
    it("should fetch and validate member awardInstances data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberawardinstancesSample)
      });

      const testParams = {
  custId: 123,
  awardId: 123
      };
      const result = await memberService.awardInstances(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/member/award_instances"),
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

  describe("chartData()", () => {
    it("should fetch and validate member chartData data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberchartdataSample)
      });

      const testParams = {
  custId: 123,
  categoryId: 123,
  chartType: 123
      };
      const result = await memberService.chartData(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/member/chart_data"),
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
    it("should fetch and validate member get data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(membergetSample)
      });

      const testParams = {
  custIds: [123, 456],
  includeLicenses: true
      };
      const result = await memberService.get(testParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("https://members-ng.iracing.com/data/member/get"),
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

  describe("info()", () => {
    it("should fetch and validate member info data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberinfoSample)
      });

      const result = await memberService.info();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/member/info",
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

  describe("participationCredits()", () => {
    it("should fetch and validate member participationCredits data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberparticipationcreditsSample)
      });

      const result = await memberService.participationCredits();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/member/participation_credits",
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

  describe("profile()", () => {
    it("should fetch and validate member profile data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(memberprofileSample)
      });

      const result = await memberService.profile();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://members-ng.iracing.com/data/member/profile",
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