import type { IRacingClient } from "../client";
import type { TeamGetParams, TeamMembershipParams } from "./team.types";

export class TeamService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/team/get
   */
  async get(params: TeamGetParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/team/get", params);
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/team/membership
   */
  async membership(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/team/membership");
  }

}