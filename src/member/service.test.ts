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
      email: "test@example.com",
      password: "password",
      fetchFn: mockFetch
    });
    
    memberService = new MemberService(client);
  });

  describe("awards()", () => {
    it("should fetch, transform, and validate member awards data", async () => {
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
        json: () => Promise.resolve(memberawardsSample)
      });

      const testParams = {
  custId: 123
      };
      const result = await memberService.awards(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/member/awards"),
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
  custId: 123
      };
      await expect(memberService.awards(testParams)).rejects.toThrow();
    });
  });

  describe("awardInstances()", () => {
    it("should fetch, transform, and validate member awardInstances data", async () => {
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
        json: () => Promise.resolve(memberawardinstancesSample)
      });

      const testParams = {
  custId: 123,
  awardId: 123
      };
      const result = await memberService.awardInstances(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/member/award_instances"),
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
  custId: 123,
  awardId: 123
      };
      await expect(memberService.awardInstances(testParams)).rejects.toThrow();
    });
  });

  describe("chartData()", () => {
    it("should fetch, transform, and validate member chartData data", async () => {
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
        json: () => Promise.resolve(memberchartdataSample)
      });

      const testParams = {
  custId: 123,
  categoryId: 123,
  chartType: 123
      };
      const result = await memberService.chartData(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/member/chart_data"),
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
  custId: 123,
  categoryId: 123,
  chartType: 123
      };
      await expect(memberService.chartData(testParams)).rejects.toThrow();
    });
  });

  describe("get()", () => {
    it("should fetch, transform, and validate member get data", async () => {
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
        json: () => Promise.resolve(membergetSample)
      });

      const testParams = {
  custIds: [123, 456],
  includeLicenses: true
      };
      const result = await memberService.get(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/member/get"),
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
  custIds: [123, 456],
  includeLicenses: true
      };
      await expect(memberService.get(testParams)).rejects.toThrow();
    });
  });

  describe("info()", () => {
    it("should fetch, transform, and validate member info data", async () => {
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
        json: () => Promise.resolve(memberinfoSample)
      });

      const result = await memberService.info();

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
        "https://members-ng.iracing.com/data/member/info",
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

      await expect(memberService.info()).rejects.toThrow();
    });
  });

  describe("participationCredits()", () => {
    it("should fetch, transform, and validate member participationCredits data", async () => {
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
        json: () => Promise.resolve(memberparticipationcreditsSample)
      });

      const result = await memberService.participationCredits();

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
        "https://members-ng.iracing.com/data/member/participation_credits",
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

      await expect(memberService.participationCredits()).rejects.toThrow();
    });
  });

  describe("profile()", () => {
    it("should fetch, transform, and validate member profile data", async () => {
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
        json: () => Promise.resolve(memberprofileSample)
      });

      const testParams = {
  custId: 123
      };
      const result = await memberService.profile(testParams);

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
        expect.stringContaining("https://members-ng.iracing.com/data/member/profile"),
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
  custId: 123
      };
      await expect(memberService.profile(testParams)).rejects.toThrow();
    });
  });

});