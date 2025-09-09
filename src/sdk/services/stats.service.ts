import type { IRacingClient } from "../client";
import type { StatsMemberBestsParams, StatsMemberCareerParams, StatsMemberDivisionParams, StatsMemberRecapParams, StatsMemberRecentRacesParams, StatsMemberSummaryParams, StatsMemberYearlyParams, StatsSeasonDriverStandingsParams, StatsSeasonSupersessionStandingsParams, StatsSeasonTeamStandingsParams, StatsSeasonTtStandingsParams, StatsSeasonTtResultsParams, StatsSeasonQualifyResultsParams, StatsWorldRecordsParams } from "./stats.types";

export class StatsService {
  constructor(private client: IRacingClient) {}

  /**
   * member_bests
   * @see https://members-ng.iracing.com/data/stats/member_bests
   */
  async member_bests(params: StatsMemberBestsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_bests", params);
  }

  /**
   * member_career
   * @see https://members-ng.iracing.com/data/stats/member_career
   */
  async member_career(params: StatsMemberCareerParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_career", params);
  }

  /**
   * member_division
   * @see https://members-ng.iracing.com/data/stats/member_division
   */
  async member_division(params: StatsMemberDivisionParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_division", params);
  }

  /**
   * member_recap
   * @see https://members-ng.iracing.com/data/stats/member_recap
   */
  async member_recap(params: StatsMemberRecapParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_recap", params);
  }

  /**
   * member_recent_races
   * @see https://members-ng.iracing.com/data/stats/member_recent_races
   */
  async member_recent_races(params: StatsMemberRecentRacesParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_recent_races", params);
  }

  /**
   * member_summary
   * @see https://members-ng.iracing.com/data/stats/member_summary
   */
  async member_summary(params: StatsMemberSummaryParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_summary", params);
  }

  /**
   * member_yearly
   * @see https://members-ng.iracing.com/data/stats/member_yearly
   */
  async member_yearly(params: StatsMemberYearlyParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/member_yearly", params);
  }

  /**
   * season_driver_standings
   * @see https://members-ng.iracing.com/data/stats/season_driver_standings
   */
  async season_driver_standings(params: StatsSeasonDriverStandingsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_driver_standings", params);
  }

  /**
   * season_supersession_standings
   * @see https://members-ng.iracing.com/data/stats/season_supersession_standings
   */
  async season_supersession_standings(params: StatsSeasonSupersessionStandingsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_supersession_standings", params);
  }

  /**
   * season_team_standings
   * @see https://members-ng.iracing.com/data/stats/season_team_standings
   */
  async season_team_standings(params: StatsSeasonTeamStandingsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_team_standings", params);
  }

  /**
   * season_tt_standings
   * @see https://members-ng.iracing.com/data/stats/season_tt_standings
   */
  async season_tt_standings(params: StatsSeasonTtStandingsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_tt_standings", params);
  }

  /**
   * season_tt_results
   * @see https://members-ng.iracing.com/data/stats/season_tt_results
   */
  async season_tt_results(params: StatsSeasonTtResultsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_tt_results", params);
  }

  /**
   * season_qualify_results
   * @see https://members-ng.iracing.com/data/stats/season_qualify_results
   */
  async season_qualify_results(params: StatsSeasonQualifyResultsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/season_qualify_results", params);
  }

  /**
   * world_records
   * @see https://members-ng.iracing.com/data/stats/world_records
   */
  async world_records(params: StatsWorldRecordsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/stats/world_records", params);
  }

}