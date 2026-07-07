import type { IRacingClient } from "../client";
import type { HostedCombinedSessionsParams, HostedCombinedSessionsResponse, HostedSessionsResponse } from "./types";
import * as z from "zod/mini";
import { HostedCombinedSessions, HostedSessions } from "./types";

const combinedSessionsParams = z.object({
  packageId: z.optional(z.number()), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

export class HostedService {
  constructor(private client: IRacingClient) {}

  /**
   * combined_sessions
   * @see https://members-ng.iracing.com/data/hosted/combined_sessions
   * @sample hosted.combined_sessions.json
   */
  async combinedSessions(params?: HostedCombinedSessionsParams): Promise<HostedCombinedSessionsResponse> {
    return this.client.get<HostedCombinedSessionsResponse>("https://members-ng.iracing.com/data/hosted/combined_sessions", { params, paramsValidator: combinedSessionsParams, schema: HostedCombinedSessions });
  }

  /**
   * sessions
   * @see https://members-ng.iracing.com/data/hosted/sessions
   * @sample hosted.sessions.json
   */
  async sessions(): Promise<HostedSessionsResponse> {
    return this.client.get<HostedSessionsResponse>("https://members-ng.iracing.com/data/hosted/sessions", { schema: HostedSessions });
  }

}