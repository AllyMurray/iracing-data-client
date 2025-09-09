import type { IRacingClient } from "../client";
import type { LeagueCustLeagueSessionsParams, LeagueDirectoryParams, LeagueGetParams, LeagueGetPointsSystemsParams, LeagueMembershipParams, LeagueRosterParams, LeagueSeasonsParams, LeagueSeasonStandingsParams, LeagueSeasonSessionsParams, LeagueCustLeagueSessionsResponse, LeagueDirectoryResponse, LeagueGetResponse, LeagueGetPointsSystemsResponse, LeagueMembershipResponse, LeagueRosterResponse, LeagueSeasonsResponse, LeagueSeasonStandingsResponse, LeagueSeasonSessionsResponse } from "./types";
import { LeagueCustLeagueSessionsSchema, LeagueDirectorySchema, LeagueGetSchema, LeagueGetPointsSystemsSchema, LeagueMembershipSchema, LeagueRosterSchema, LeagueSeasonsSchema, LeagueSeasonStandingsSchema, LeagueSeasonSessionsSchema } from "./types";

export class LeagueService {
  constructor(private client: IRacingClient) {}

  /**
   * cust_league_sessions
   * @see https://members-ng.iracing.com/data/league/cust_league_sessions
   * @sample league.cust_league_sessions.json
   */
  async custLeagueSessions(params: LeagueCustLeagueSessionsParams): Promise<LeagueCustLeagueSessionsResponse> {
    return this.client.get<LeagueCustLeagueSessionsResponse>("https://members-ng.iracing.com/data/league/cust_league_sessions", { params, schema: LeagueCustLeagueSessionsSchema as any });
  }

  /**
   * directory
   * @see https://members-ng.iracing.com/data/league/directory
   * @sample league.directory.json
   */
  async directory(params: LeagueDirectoryParams): Promise<LeagueDirectoryResponse> {
    return this.client.get<LeagueDirectoryResponse>("https://members-ng.iracing.com/data/league/directory", { params, schema: LeagueDirectorySchema as any });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/league/get
   * @sample league.get.json
   */
  async get(params: LeagueGetParams): Promise<LeagueGetResponse> {
    return this.client.get<LeagueGetResponse>("https://members-ng.iracing.com/data/league/get", { params, schema: LeagueGetSchema as any });
  }

  /**
   * get_points_systems
   * @see https://members-ng.iracing.com/data/league/get_points_systems
   * @sample league.get_points_systems.json
   */
  async getPointsSystems(params: LeagueGetPointsSystemsParams): Promise<LeagueGetPointsSystemsResponse> {
    return this.client.get<LeagueGetPointsSystemsResponse>("https://members-ng.iracing.com/data/league/get_points_systems", { params, schema: LeagueGetPointsSystemsSchema as any });
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/league/membership
   * @sample league.membership.json
   */
  async membership(params: LeagueMembershipParams): Promise<LeagueMembershipResponse> {
    return this.client.get<LeagueMembershipResponse>("https://members-ng.iracing.com/data/league/membership", { params, schema: LeagueMembershipSchema as any });
  }

  /**
   * roster
   * @see https://members-ng.iracing.com/data/league/roster
   * @sample league.roster.json
   */
  async roster(params: LeagueRosterParams): Promise<LeagueRosterResponse> {
    return this.client.get<LeagueRosterResponse>("https://members-ng.iracing.com/data/league/roster", { params, schema: LeagueRosterSchema as any });
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/league/seasons
   * @sample league.seasons.json
   */
  async seasons(params: LeagueSeasonsParams): Promise<LeagueSeasonsResponse> {
    return this.client.get<LeagueSeasonsResponse>("https://members-ng.iracing.com/data/league/seasons", { params, schema: LeagueSeasonsSchema as any });
  }

  /**
   * season_standings
   * @see https://members-ng.iracing.com/data/league/season_standings
   * @sample league.season_standings.json
   */
  async seasonStandings(params: LeagueSeasonStandingsParams): Promise<LeagueSeasonStandingsResponse> {
    return this.client.get<LeagueSeasonStandingsResponse>("https://members-ng.iracing.com/data/league/season_standings", { params, schema: LeagueSeasonStandingsSchema as any });
  }

  /**
   * season_sessions
   * @see https://members-ng.iracing.com/data/league/season_sessions
   * @sample league.season_sessions.json
   */
  async seasonSessions(params: LeagueSeasonSessionsParams): Promise<LeagueSeasonSessionsResponse> {
    return this.client.get<LeagueSeasonSessionsResponse>("https://members-ng.iracing.com/data/league/season_sessions", { params, schema: LeagueSeasonSessionsSchema as any });
  }

}