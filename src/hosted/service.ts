import type { IRacingClient } from "../client";
import type { HostedCombinedSessionsParams, HostedCombinedSessionsResponse, HostedSessionsResponse } from "./types";
import { HostedCombinedSessionsSchema, HostedSessionsSchema } from "./types";

export class HostedService {
  constructor(private client: IRacingClient) {}

  /**
   * combined_sessions
   * @see https://members-ng.iracing.com/data/hosted/combined_sessions
   * @sample hosted.combined_sessions.json
   */
  async combinedSessions(params: HostedCombinedSessionsParams): Promise<HostedCombinedSessionsResponse> {
    return this.client.get<HostedCombinedSessionsResponse>("https://members-ng.iracing.com/data/hosted/combined_sessions", { params, schema: HostedCombinedSessionsSchema });
  }

  /**
   * sessions
   * @see https://members-ng.iracing.com/data/hosted/sessions
   * @sample hosted.sessions.json
   */
  async sessions(): Promise<HostedSessionsResponse> {
    return this.client.get<HostedSessionsResponse>("https://members-ng.iracing.com/data/hosted/sessions", { schema: HostedSessionsSchema });
  }

}