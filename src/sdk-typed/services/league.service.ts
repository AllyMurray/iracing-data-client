import type { IRacingClient } from "../client";
import type { LeagueCustLeagueSessionsParams, LeagueDirectoryParams, LeagueGetParams, LeagueGetPointsSystemsParams, LeagueMembershipParams, LeagueRosterParams, LeagueSeasonsParams, LeagueSeasonStandingsParams, LeagueSeasonSessionsParams, LeagueCustLeagueSessionsResponse, LeagueDirectoryResponse, LeagueGetResponse, LeagueGetPointsSystemsResponse, LeagueMembershipResponse, LeagueRosterResponse, LeagueSeasonsResponse, LeagueSeasonStandingsResponse, LeagueSeasonSessionsResponse } from "./league.types";

export class LeagueService {
  constructor(private client: IRacingClient) {}

  /**
   * cust_league_sessions
   * @see https://members-ng.iracing.com/data/league/cust_league_sessions
   * @sample league.cust_league_sessions.json
   */
  async cust_league_sessions(params: LeagueCustLeagueSessionsParams): Promise<LeagueCustLeagueSessionsResponse> {
    return this.client.get<LeagueCustLeagueSessionsResponse>("https://members-ng.iracing.com/data/league/cust_league_sessions", params);
  }

  /**
   * directory
   * @see https://members-ng.iracing.com/data/league/directory
   * @sample league.directory.json
   */
  async directory(params: LeagueDirectoryParams): Promise<LeagueDirectoryResponse> {
    return this.client.get<LeagueDirectoryResponse>("https://members-ng.iracing.com/data/league/directory", params);
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/league/get
   * @sample league.get.json
   */
  async get(params: LeagueGetParams): Promise<LeagueGetResponse> {
    return this.client.get<LeagueGetResponse>("https://members-ng.iracing.com/data/league/get", params);
  }

  /**
   * get_points_systems
   * @see https://members-ng.iracing.com/data/league/get_points_systems
   * @sample league.get_points_systems.json
   */
  async get_points_systems(params: LeagueGetPointsSystemsParams): Promise<LeagueGetPointsSystemsResponse> {
    return this.client.get<LeagueGetPointsSystemsResponse>("https://members-ng.iracing.com/data/league/get_points_systems", params);
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/league/membership
   * @sample league.membership.json
   */
  async membership(params: LeagueMembershipParams): Promise<LeagueMembershipResponse> {
    return this.client.get<LeagueMembershipResponse>("https://members-ng.iracing.com/data/league/membership", params);
  }

  /**
   * roster
   * @see https://members-ng.iracing.com/data/league/roster
   * @sample league.roster.json
   */
  async roster(params: LeagueRosterParams): Promise<LeagueRosterResponse> {
    return this.client.get<LeagueRosterResponse>("https://members-ng.iracing.com/data/league/roster", params);
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/league/seasons
   * @sample league.seasons.json
   */
  async seasons(params: LeagueSeasonsParams): Promise<LeagueSeasonsResponse> {
    return this.client.get<LeagueSeasonsResponse>("https://members-ng.iracing.com/data/league/seasons", params);
  }

  /**
   * season_standings
   * @see https://members-ng.iracing.com/data/league/season_standings
   * @sample league.season_standings.json
   */
  async season_standings(params: LeagueSeasonStandingsParams): Promise<LeagueSeasonStandingsResponse> {
    return this.client.get<LeagueSeasonStandingsResponse>("https://members-ng.iracing.com/data/league/season_standings", params);
  }

  /**
   * season_sessions
   * @see https://members-ng.iracing.com/data/league/season_sessions
   * @sample league.season_sessions.json
   */
  async season_sessions(params: LeagueSeasonSessionsParams): Promise<LeagueSeasonSessionsResponse> {
    return this.client.get<LeagueSeasonSessionsResponse>("https://members-ng.iracing.com/data/league/season_sessions", params);
  }

}