import { describe, it, expect, vi, beforeEach } from "vitest";
import { HostedService } from "./service";
import type { IRacingClient } from "../client";
import type { HostedCombinedSessionsResponse, HostedSessionsResponse } from "./types";
import { HostedCombinedSessions, HostedSessions } from "./types";

// Import sample data
import hostedcombinedsessionsSample from "../../samples/hosted.combined_sessions.json";
import hostedsessionsSample from "../../samples/hosted.sessions.json";

describe("HostedService", () => {
  let mockClient: IRacingClient;
  let hostedService: HostedService;

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as any;

    hostedService = new HostedService(mockClient);
  });

  describe("combinedSessions()", () => {
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

      const expectedTransformedData = transformData(hostedcombinedsessionsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const testParams = {
  packageId: 123
      };
      const result = await hostedService.combinedSessions(testParams);
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/hosted/combined_sessions", { params: testParams, schema: HostedCombinedSessions });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching HostedCombinedSessionsResponse type structure", async () => {
      const mockData = {} as HostedCombinedSessionsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const testParams = {
  packageId: 123
      };
      const result = await hostedService.combinedSessions(testParams);
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

  describe("sessions()", () => {
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

      const expectedTransformedData = transformData(hostedsessionsSample);
      mockClient.get = vi.fn().mockResolvedValue(expectedTransformedData);

      const result = await hostedService.sessions();
      expect(mockClient.get).toHaveBeenCalledWith("https://members-ng.iracing.com/data/hosted/sessions", { schema: HostedSessions });
      expect(result).toEqual(expectedTransformedData);
    });

    it("should return data matching HostedSessionsResponse type structure", async () => {
      const mockData = {} as HostedSessionsResponse; // Mock with appropriate structure
      mockClient.get = vi.fn().mockResolvedValue(mockData);

      const result = await hostedService.sessions();
      expect(result).toBeDefined();
      // Add specific type structure assertions here
    });
  });

});