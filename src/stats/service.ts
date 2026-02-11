import type { IRacingClient } from "../client";
import type { StatsMemberBestsParams, StatsMemberCareerParams, StatsMemberDivisionParams, StatsMemberRecapParams, StatsMemberRecentRacesParams, StatsMemberSummaryParams, StatsMemberYearlyParams, StatsSeasonDriverStandingsParams, StatsSeasonSupersessionStandingsParams, StatsSeasonTeamStandingsParams, StatsSeasonTtStandingsParams, StatsSeasonTtResultsParams, StatsSeasonQualifyResultsParams, StatsWorldRecordsParams, StatsMemberBestsResponse, StatsMemberCareerResponse, StatsMemberDivisionResponse, StatsMemberRecapResponse, StatsMemberRecentRacesResponse, StatsMemberSummaryResponse, StatsMemberYearlyResponse, StatsSeasonDriverStandingsResponse, StatsSeasonSupersessionStandingsResponse, StatsSeasonTeamStandingsResponse, StatsSeasonTtStandingsResponse, StatsSeasonTtResultsResponse, StatsSeasonQualifyResultsResponse, StatsWorldRecordsResponse } from "./types";
import { StatsMemberBests, StatsMemberCareer, StatsMemberDivision, StatsMemberRecap, StatsMemberRecentRaces, StatsMemberSummary, StatsMemberYearly, StatsSeasonDriverStandings, StatsSeasonSupersessionStandings, StatsSeasonTeamStandings, StatsSeasonTtStandings, StatsSeasonTtResults, StatsSeasonQualifyResults, StatsWorldRecords } from "./types";

export class StatsService {
  constructor(private client: IRacingClient) {}

  /**
   * member_bests
   * @see https://members-ng.iracing.com/data/stats/member_bests
   * @sample stats.member_bests.json
   */
  async memberBests(params: StatsMemberBestsParams): Promise<StatsMemberBestsResponse> {
    return this.client.get<StatsMemberBestsResponse>("https://members-ng.iracing.com/data/stats/member_bests", { params, schema: StatsMemberBests });
  }

  /**
   * member_career
   * @see https://members-ng.iracing.com/data/stats/member_career
   * @sample stats.member_career.json
   */
  async memberCareer(params: StatsMemberCareerParams): Promise<StatsMemberCareerResponse> {
    return this.client.get<StatsMemberCareerResponse>("https://members-ng.iracing.com/data/stats/member_career", { params, schema: StatsMemberCareer });
  }

  /**
   * member_division
   * @see https://members-ng.iracing.com/data/stats/member_division
   * @sample stats.member_division.json
   */
  async memberDivision(params: StatsMemberDivisionParams): Promise<StatsMemberDivisionResponse> {
    return this.client.get<StatsMemberDivisionResponse>("https://members-ng.iracing.com/data/stats/member_division", { params, schema: StatsMemberDivision });
  }

  /**
   * member_recap
   * @see https://members-ng.iracing.com/data/stats/member_recap
   * @sample stats.member_recap.json
   */
  async memberRecap(params: StatsMemberRecapParams): Promise<StatsMemberRecapResponse> {
    return this.client.get<StatsMemberRecapResponse>("https://members-ng.iracing.com/data/stats/member_recap", { params, schema: StatsMemberRecap });
  }

  /**
   * member_recent_races
   * @see https://members-ng.iracing.com/data/stats/member_recent_races
   * @sample stats.member_recent_races.json
   */
  async memberRecentRaces(params: StatsMemberRecentRacesParams): Promise<StatsMemberRecentRacesResponse> {
    return this.client.get<StatsMemberRecentRacesResponse>("https://members-ng.iracing.com/data/stats/member_recent_races", { params, schema: StatsMemberRecentRaces });
  }

  /**
   * member_summary
   * @see https://members-ng.iracing.com/data/stats/member_summary
   * @sample stats.member_summary.json
   */
  async memberSummary(params: StatsMemberSummaryParams): Promise<StatsMemberSummaryResponse> {
    return this.client.get<StatsMemberSummaryResponse>("https://members-ng.iracing.com/data/stats/member_summary", { params, schema: StatsMemberSummary });
  }

  /**
   * member_yearly
   * @see https://members-ng.iracing.com/data/stats/member_yearly
   * @sample stats.member_yearly.json
   */
  async memberYearly(params: StatsMemberYearlyParams): Promise<StatsMemberYearlyResponse> {
    return this.client.get<StatsMemberYearlyResponse>("https://members-ng.iracing.com/data/stats/member_yearly", { params, schema: StatsMemberYearly });
  }

  /**
   * season_driver_standings
   * @see https://members-ng.iracing.com/data/stats/season_driver_standings
   * @sample stats.season_driver_standings.json
   */
  async seasonDriverStandings(params: StatsSeasonDriverStandingsParams): Promise<StatsSeasonDriverStandingsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_driver_standings', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonDriverStandingsResponse>("https://members-ng.iracing.com/data/stats/season_driver_standings", { params, schema: StatsSeasonDriverStandings });
  }

  /**
   * season_supersession_standings
   * @see https://members-ng.iracing.com/data/stats/season_supersession_standings
   * @sample stats.season_supersession_standings.json
   */
  async seasonSupersessionStandings(params: StatsSeasonSupersessionStandingsParams): Promise<StatsSeasonSupersessionStandingsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_supersession_standings', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonSupersessionStandingsResponse>("https://members-ng.iracing.com/data/stats/season_supersession_standings", { params, schema: StatsSeasonSupersessionStandings });
  }

  /**
   * season_team_standings
   * @see https://members-ng.iracing.com/data/stats/season_team_standings
   * @sample stats.season_team_standings.json
   */
  async seasonTeamStandings(params: StatsSeasonTeamStandingsParams): Promise<StatsSeasonTeamStandingsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_team_standings', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonTeamStandingsResponse>("https://members-ng.iracing.com/data/stats/season_team_standings", { params, schema: StatsSeasonTeamStandings });
  }

  /**
   * season_tt_standings
   * @see https://members-ng.iracing.com/data/stats/season_tt_standings
   * @sample stats.season_tt_standings.json
   */
  async seasonTtStandings(params: StatsSeasonTtStandingsParams): Promise<StatsSeasonTtStandingsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_tt_standings', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonTtStandingsResponse>("https://members-ng.iracing.com/data/stats/season_tt_standings", { params, schema: StatsSeasonTtStandings });
  }

  /**
   * season_tt_results
   * @see https://members-ng.iracing.com/data/stats/season_tt_results
   * @sample stats.season_tt_results.json
   */
  async seasonTtResults(params: StatsSeasonTtResultsParams): Promise<StatsSeasonTtResultsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_tt_results', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonTtResultsResponse>("https://members-ng.iracing.com/data/stats/season_tt_results", { params, schema: StatsSeasonTtResults });
  }

  /**
   * season_qualify_results
   * @see https://members-ng.iracing.com/data/stats/season_qualify_results
   * @sample stats.season_qualify_results.json
   */
  async seasonQualifyResults(params: StatsSeasonQualifyResultsParams): Promise<StatsSeasonQualifyResultsResponse> {
    await this.client.ensureSeasonCarClassPair('stats.season_qualify_results', params.seasonId, params.carClassId);
    return this.client.get<StatsSeasonQualifyResultsResponse>("https://members-ng.iracing.com/data/stats/season_qualify_results", { params, schema: StatsSeasonQualifyResults });
  }

  /**
   * world_records
   * @see https://members-ng.iracing.com/data/stats/world_records
   * @sample stats.world_records.json
   */
  async worldRecords(params: StatsWorldRecordsParams): Promise<StatsWorldRecordsResponse> {
    return this.client.get<StatsWorldRecordsResponse>("https://members-ng.iracing.com/data/stats/world_records", { params, schema: StatsWorldRecords });
  }

}