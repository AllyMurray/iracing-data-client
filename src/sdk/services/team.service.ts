import type { IRacingClient } from "../client";
import type { TeamGetParams, TeamMembershipParams, TeamMembershipResponse } from "./team.types";

export class TeamService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/team/get
   */
  async get(params: TeamGetParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/team/get", params);
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/team/membership
   * @sample team.membership.json
   */
  async membership(): Promise<TeamMembershipResponse> {
    return this.client.get<TeamMembershipResponse>("https://members-ng.iracing.com/data/team/membership");
  }

}