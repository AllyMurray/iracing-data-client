import type { IRacingClient } from "../client";
import type { LeagueCustLeagueSessionsParams, LeagueDirectoryParams, LeagueGetParams, LeagueGetPointsSystemsParams, LeagueMembershipParams, LeagueRosterParams, LeagueSeasonsParams, LeagueSeasonStandingsParams, LeagueSeasonSessionsParams } from "./league.types";

export class LeagueService {
  constructor(private client: IRacingClient) {}

  /**
   * cust_league_sessions
   * @see https://members-ng.iracing.com/data/league/cust_league_sessions
   */
  async cust_league_sessions(params: LeagueCustLeagueSessionsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/cust_league_sessions", params);
  }

  /**
   * directory
   * @see https://members-ng.iracing.com/data/league/directory
   */
  async directory(params: LeagueDirectoryParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/directory", params);
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/league/get
   */
  async get(params: LeagueGetParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/get", params);
  }

  /**
   * get_points_systems
   * @see https://members-ng.iracing.com/data/league/get_points_systems
   */
  async get_points_systems(params: LeagueGetPointsSystemsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/get_points_systems", params);
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/league/membership
   */
  async membership(params: LeagueMembershipParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/membership", params);
  }

  /**
   * roster
   * @see https://members-ng.iracing.com/data/league/roster
   */
  async roster(params: LeagueRosterParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/roster", params);
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/league/seasons
   */
  async seasons(params: LeagueSeasonsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/seasons", params);
  }

  /**
   * season_standings
   * @see https://members-ng.iracing.com/data/league/season_standings
   */
  async season_standings(params: LeagueSeasonStandingsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/season_standings", params);
  }

  /**
   * season_sessions
   * @see https://members-ng.iracing.com/data/league/season_sessions
   */
  async season_sessions(params: LeagueSeasonSessionsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/league/season_sessions", params);
  }

}