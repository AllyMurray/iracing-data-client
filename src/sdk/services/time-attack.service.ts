import type { IRacingClient } from "../client";
import type { TimeAttackMemberSeasonResultsParams } from "./time-attack.types";

export class TimeAttackService {
  constructor(private client: IRacingClient) {}

  /**
   * member_season_results
   * @see https://members-ng.iracing.com/data/time_attack/member_season_results
   */
  async member_season_results(params: TimeAttackMemberSeasonResultsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/time_attack/member_season_results", params);
  }

}