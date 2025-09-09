import type { IRacingClient } from "../client";
import type { StatsMemberBestsParams, StatsMemberCareerParams, StatsMemberDivisionParams, StatsMemberRecapParams, StatsMemberRecentRacesParams, StatsMemberSummaryParams, StatsMemberYearlyParams, StatsSeasonDriverStandingsParams, StatsSeasonSupersessionStandingsParams, StatsSeasonTeamStandingsParams, StatsSeasonTtStandingsParams, StatsSeasonTtResultsParams, StatsSeasonQualifyResultsParams, StatsWorldRecordsParams, StatsMemberBestsResponse, StatsMemberCareerResponse, StatsMemberRecapResponse, StatsMemberRecentRacesResponse, StatsMemberSummaryResponse, StatsMemberYearlyResponse, StatsWorldRecordsResponse } from "./types";
import { StatsMemberBestsSchema, StatsMemberCareerSchema, StatsMemberRecapSchema, StatsMemberRecentRacesSchema, StatsMemberSummarySchema, StatsMemberYearlySchema, StatsWorldRecordsSchema } from "./types";

export class StatsService {
  constructor(private client: IRacingClient) {}

  /**
   * member_bests
   * @see https://members-ng.iracing.com/data/stats/member_bests
   * @sample stats.member_bests.json
   */
  async memberBests(params: StatsMemberBestsParams): Promise<StatsMemberBestsResponse> {
    return this.client.get<StatsMemberBestsResponse>("https://members-ng.iracing.com/data/stats/member_bests", { params, schema: StatsMemberBestsSchema });
  }

  /**
   * member_career
   * @see https://members-ng.iracing.com/data/stats/member_career
   * @sample stats.member_career.json
   */
  async memberCareer(params: StatsMemberCareerParams): Promise<StatsMemberCareerResponse> {
    return this.client.get<StatsMemberCareerResponse>("https://members-ng.iracing.com/data/stats/member_career", { params, schema: StatsMemberCareerSchema });
  }

  /**
   * member_division
   * @see https://members-ng.iracing.com/data/stats/member_division
   */
  async memberDivision(params: StatsMemberDivisionParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/member_division", { params });
  }

  /**
   * member_recap
   * @see https://members-ng.iracing.com/data/stats/member_recap
   * @sample stats.member_recap.json
   */
  async memberRecap(params: StatsMemberRecapParams): Promise<StatsMemberRecapResponse> {
    return this.client.get<StatsMemberRecapResponse>("https://members-ng.iracing.com/data/stats/member_recap", { params, schema: StatsMemberRecapSchema });
  }

  /**
   * member_recent_races
   * @see https://members-ng.iracing.com/data/stats/member_recent_races
   * @sample stats.member_recent_races.json
   */
  async memberRecentRaces(params: StatsMemberRecentRacesParams): Promise<StatsMemberRecentRacesResponse> {
    return this.client.get<StatsMemberRecentRacesResponse>("https://members-ng.iracing.com/data/stats/member_recent_races", { params, schema: StatsMemberRecentRacesSchema });
  }

  /**
   * member_summary
   * @see https://members-ng.iracing.com/data/stats/member_summary
   * @sample stats.member_summary.json
   */
  async memberSummary(params: StatsMemberSummaryParams): Promise<StatsMemberSummaryResponse> {
    return this.client.get<StatsMemberSummaryResponse>("https://members-ng.iracing.com/data/stats/member_summary", { params, schema: StatsMemberSummarySchema });
  }

  /**
   * member_yearly
   * @see https://members-ng.iracing.com/data/stats/member_yearly
   * @sample stats.member_yearly.json
   */
  async memberYearly(params: StatsMemberYearlyParams): Promise<StatsMemberYearlyResponse> {
    return this.client.get<StatsMemberYearlyResponse>("https://members-ng.iracing.com/data/stats/member_yearly", { params, schema: StatsMemberYearlySchema });
  }

  /**
   * season_driver_standings
   * @see https://members-ng.iracing.com/data/stats/season_driver_standings
   */
  async seasonDriverStandings(params: StatsSeasonDriverStandingsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_driver_standings", { params });
  }

  /**
   * season_supersession_standings
   * @see https://members-ng.iracing.com/data/stats/season_supersession_standings
   */
  async seasonSupersessionStandings(params: StatsSeasonSupersessionStandingsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_supersession_standings", { params });
  }

  /**
   * season_team_standings
   * @see https://members-ng.iracing.com/data/stats/season_team_standings
   */
  async seasonTeamStandings(params: StatsSeasonTeamStandingsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_team_standings", { params });
  }

  /**
   * season_tt_standings
   * @see https://members-ng.iracing.com/data/stats/season_tt_standings
   */
  async seasonTtStandings(params: StatsSeasonTtStandingsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_tt_standings", { params });
  }

  /**
   * season_tt_results
   * @see https://members-ng.iracing.com/data/stats/season_tt_results
   */
  async seasonTtResults(params: StatsSeasonTtResultsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_tt_results", { params });
  }

  /**
   * season_qualify_results
   * @see https://members-ng.iracing.com/data/stats/season_qualify_results
   */
  async seasonQualifyResults(params: StatsSeasonQualifyResultsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/stats/season_qualify_results", { params });
  }

  /**
   * world_records
   * @see https://members-ng.iracing.com/data/stats/world_records
   * @sample stats.world_records.json
   */
  async worldRecords(params: StatsWorldRecordsParams): Promise<StatsWorldRecordsResponse> {
    return this.client.get<StatsWorldRecordsResponse>("https://members-ng.iracing.com/data/stats/world_records", { params, schema: StatsWorldRecordsSchema });
  }

}