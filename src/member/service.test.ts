import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemberService } from "./service";
import type { IRacingClient } from "../client";
import type { MemberAwardsResponse, MemberAwardInstancesResponse, MemberChartDataResponse, MemberGetResponse, MemberInfoResponse, MemberParticipationCreditsResponse, MemberProfileResponse } from "./types";
import { MemberAwards, MemberAwardInstances, MemberChartData, MemberGet, MemberInfo, MemberParticipationCredits, MemberProfile } from "./types";

// Import sample data
import memberawardsSample from "../../samples/member.awards.json";
import memberawardinstancesSample from "../../samples/member.award_instances.json";
import memberchartdataSample from "../../samples/member.chart_data.json";
import membergetSample from "../../samples/member.get.json";
import memberinfoSample from "../../samples/member.info.json";
import memberparticipationcreditsSample from "../../samples/member.participation_credits.json";
import memberprofileSample from "../../samples/member.profile.json";

describe("MemberService", () => {
  let mockClient: IRacingClient;
  let memberService: MemberService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    memberService = new MemberService(mockClient);
  });

  describe("awards()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberawardsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await memberService.awards(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/awards", { params: testParams, schema: MemberAwards });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberAwardsResponse type structure", async () => {
      const mockData = {} as MemberAwardsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await memberService.awards(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("awardInstances()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberawardinstancesSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123,
  awardId: 123
      };
      const result = await memberService.awardInstances(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/award_instances", { params: testParams, schema: MemberAwardInstances });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberAwardInstancesResponse type structure", async () => {
      const mockData = {} as MemberAwardInstancesResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123,
  awardId: 123
      };
      const result = await memberService.awardInstances(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("chartData()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberchartdataSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123,
  categoryId: 123,
  chartType: 123
      };
      const result = await memberService.chartData(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/chart_data", { params: testParams, schema: MemberChartData });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberChartDataResponse type structure", async () => {
      const mockData = {} as MemberChartDataResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123,
  categoryId: 123,
  chartType: 123
      };
      const result = await memberService.chartData(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("get()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(membergetSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custIds: [123, 456],
  includeLicenses: true
      };
      const result = await memberService.get(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/get", { params: testParams, schema: MemberGet });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberGetResponse type structure", async () => {
      const mockData = {} as MemberGetResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custIds: [123, 456],
  includeLicenses: true
      };
      const result = await memberService.get(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("info()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberinfoSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await memberService.info();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/info", { schema: MemberInfo });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberInfoResponse type structure", async () => {
      const mockData = {} as MemberInfoResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await memberService.info();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("participationCredits()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberparticipationcreditsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await memberService.participationCredits();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/participation_credits", { schema: MemberParticipationCredits });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberParticipationCreditsResponse type structure", async () => {
      const mockData = {} as MemberParticipationCreditsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await memberService.participationCredits();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("profile()", () => {
    it("should call client.get with correct URL and return transformed data", async () => {
      // Transform sample data to camelCase as our client would
      const transformData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(item => transformData(item));
        }
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
              transformData(value)
            ])
          );
        }
        return data;
      };

      const expectedTransformedData = transformData(memberprofileSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  custId: 123
      };
      const result = await memberService.profile(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/member/profile", { params: testParams, schema: MemberProfile });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching MemberProfileResponse type structure", async () => {
      const mockData = {} as MemberProfileResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  custId: 123
      };
      const result = await memberService.profile(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});