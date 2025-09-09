import type { IRacingClient } from "../client";
import type { HostedCombinedSessionsParams, HostedSessionsParams, HostedCombinedSessionsResponse, HostedSessionsResponse } from "./hosted.types";

export class HostedService {
  constructor(private client: IRacingClient) {}

  /**
   * combined_sessions
   * @see https://members-ng.iracing.com/data/hosted/combined_sessions
   * @sample hosted.combined_sessions.json
   */
  async combined_sessions(params: HostedCombinedSessionsParams): Promise<HostedCombinedSessionsResponse> {
    return this.client.get<HostedCombinedSessionsResponse>("https://members-ng.iracing.com/data/hosted/combined_sessions", params);
  }

  /**
   * sessions
   * @see https://members-ng.iracing.com/data/hosted/sessions
   * @sample hosted.sessions.json
   */
  async sessions(): Promise<HostedSessionsResponse> {
    return this.client.get<HostedSessionsResponse>("https://members-ng.iracing.com/data/hosted/sessions");
  }

}