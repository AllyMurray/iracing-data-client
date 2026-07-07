import type { IRacingClient } from "../client";
import type { TimeAttackMemberSeasonResultsParams, TimeAttackMemberSeasonResultsResponse } from "./types";
import * as z from "zod/mini";
import { TimeAttackMemberSeasonResults } from "./types";

const memberSeasonResultsParams = z.object({
  taCompSeasonId: z.number(), // maps to: ta_comp_season_id
});

export class TimeAttackService {
  constructor(private client: IRacingClient) {}

  /**
   * member_season_results
   * @see https://members-ng.iracing.com/data/time_attack/member_season_results
   * @sample time_attack.member_season_results.json
   */
  async memberSeasonResults(params: TimeAttackMemberSeasonResultsParams): Promise<TimeAttackMemberSeasonResultsResponse> {
    return this.client.get<TimeAttackMemberSeasonResultsResponse>("https://members-ng.iracing.com/data/time_attack/member_season_results", { params, paramsValidator: memberSeasonResultsParams, schema: TimeAttackMemberSeasonResults });
  }

}