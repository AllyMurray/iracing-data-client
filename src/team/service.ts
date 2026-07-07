import type { IRacingClient } from "../client";
import type { TeamGetParams, TeamGetResponse, TeamMembershipResponse } from "./types";
import * as z from "zod/mini";
import { TeamGet, TeamMembership } from "./types";

const getParams = z.object({
  teamId: z.number(), // maps to: team_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
});

export class TeamService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/team/get
   * @sample team.get.json
   */
  async get(params: TeamGetParams): Promise<TeamGetResponse> {
    return this.client.get<TeamGetResponse>("https://members-ng.iracing.com/data/team/get", { params, paramsValidator: getParams, schema: TeamGet });
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/team/membership
   * @sample team.membership.json
   */
  async membership(): Promise<TeamMembershipResponse> {
    return this.client.get<TeamMembershipResponse>("https://members-ng.iracing.com/data/team/membership", { schema: TeamMembership });
  }

}