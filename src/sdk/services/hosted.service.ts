import type { IRacingClient } from "../client";
import type { HostedCombinedSessionsParams, HostedSessionsParams } from "./hosted.types";

export class HostedService {
  constructor(private client: IRacingClient) {}

  /**
   * combined_sessions
   * @see https://members-ng.iracing.com/data/hosted/combined_sessions
   */
  async combined_sessions(params: HostedCombinedSessionsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/hosted/combined_sessions", params);
  }

  /**
   * sessions
   * @see https://members-ng.iracing.com/data/hosted/sessions
   */
  async sessions(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/hosted/sessions");
  }

}