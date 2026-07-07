import type { IRacingClient } from "../client";
import type { LeagueCustLeagueSessionsParams, LeagueDirectoryParams, LeagueGetParams, LeagueGetPointsSystemsParams, LeagueMembershipParams, LeagueRosterParams, LeagueSeasonsParams, LeagueSeasonStandingsParams, LeagueSeasonSessionsParams, LeagueCustLeagueSessionsResponse, LeagueDirectoryResponse, LeagueGetResponse, LeagueGetPointsSystemsResponse, LeagueMembershipResponse, LeagueRosterResponse, LeagueSeasonsResponse, LeagueSeasonStandingsResponse, LeagueSeasonSessionsResponse } from "./types";
import * as z from "zod/mini";
import { LeagueCustLeagueSessions, LeagueDirectory, LeagueGet, LeagueGetPointsSystems, LeagueMembership, LeagueRoster, LeagueSeasons, LeagueSeasonStandings, LeagueSeasonSessions } from "./types";

const custLeagueSessionsParams = z.object({
  mine: z.optional(z.boolean()), // If true, return only sessions created by this user.
  packageId: z.optional(z.number()), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

const directoryParams = z.object({
  search: z.optional(z.string()), // Will search against league name, description, owner, and league ID.
  tag: z.optional(z.string()), // One or more tags, comma-separated.
  restrictToMember: z.optional(z.boolean()), // If true include only leagues for which customer is a member. // maps to: restrict_to_member
  restrictToRecruiting: z.optional(z.boolean()), // If true include only leagues which are recruiting. // maps to: restrict_to_recruiting
  restrictToFriends: z.optional(z.boolean()), // If true include only leagues owned by a friend. // maps to: restrict_to_friends
  restrictToWatched: z.optional(z.boolean()), // If true include only leagues owned by a watched member. // maps to: restrict_to_watched
  minimumRosterCount: z.optional(z.number()), // If set include leagues with at least this number of members. // maps to: minimum_roster_count
  maximumRosterCount: z.optional(z.number()), // If set include leagues with no more than this number of members. // maps to: maximum_roster_count
  lowerbound: z.optional(z.number()), // First row of results to return.  Defaults to 1.
  upperbound: z.optional(z.number()), // Last row of results to return. Defaults to lowerbound + 39.
  sort: z.optional(z.string()), // One of relevance, leaguename, displayname, rostercount. displayname is owners's name. Defaults to relevance.
  order: z.optional(z.string()), // One of asc or desc.  Defaults to asc.
});

const getParams = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
});

const getPointsSystemsParams = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.optional(z.number()), // If included and the season is using custom points (points_system_id:2) then the custom points option is included in the returned list. Otherwise the custom points option is not returned. // maps to: season_id
});

const membershipParams = z.object({
  custId: z.optional(z.number()), // If different from the authenticated member, the following restrictions apply: - Caller cannot be on requested customer's block list or an empty list will result; - Requested customer cannot have their online activity preference set to hidden or an empty list will result; - Only leagues for which the requested customer is an admin and the league roster is not private are returned. // maps to: cust_id
  includeLeague: z.optional(z.boolean()), // maps to: include_league
});

const rosterParams = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
});

const seasonsParams = z.object({
  leagueId: z.number(), // maps to: league_id
  retired: z.optional(z.boolean()), // If true include seasons which are no longer active.
});

const seasonStandingsParams = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  carClassId: z.optional(z.number()), // maps to: car_class_id
  carId: z.optional(z.number()), // If car_class_id is included then the standings are for the car in that car class, otherwise they are for the car across car classes. // maps to: car_id
});

const seasonSessionsParams = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  resultsOnly: z.optional(z.boolean()), // If true include only sessions for which results are available. // maps to: results_only
});

export class LeagueService {
  constructor(private client: IRacingClient) {}

  /**
   * cust_league_sessions
   * @see https://members-ng.iracing.com/data/league/cust_league_sessions
   * @sample league.cust_league_sessions.json
   */
  async custLeagueSessions(params?: LeagueCustLeagueSessionsParams): Promise<LeagueCustLeagueSessionsResponse> {
    return this.client.get<LeagueCustLeagueSessionsResponse>("https://members-ng.iracing.com/data/league/cust_league_sessions", { params, paramsValidator: custLeagueSessionsParams, schema: LeagueCustLeagueSessions });
  }

  /**
   * directory
   * @see https://members-ng.iracing.com/data/league/directory
   * @sample league.directory.json
   */
  async directory(params?: LeagueDirectoryParams): Promise<LeagueDirectoryResponse> {
    return this.client.get<LeagueDirectoryResponse>("https://members-ng.iracing.com/data/league/directory", { params, paramsValidator: directoryParams, schema: LeagueDirectory });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/league/get
   * @sample league.get.json
   */
  async get(params: LeagueGetParams): Promise<LeagueGetResponse> {
    return this.client.get<LeagueGetResponse>("https://members-ng.iracing.com/data/league/get", { params, paramsValidator: getParams, schema: LeagueGet });
  }

  /**
   * get_points_systems
   * @see https://members-ng.iracing.com/data/league/get_points_systems
   * @sample league.get_points_systems.json
   */
  async getPointsSystems(params: LeagueGetPointsSystemsParams): Promise<LeagueGetPointsSystemsResponse> {
    return this.client.get<LeagueGetPointsSystemsResponse>("https://members-ng.iracing.com/data/league/get_points_systems", { params, paramsValidator: getPointsSystemsParams, schema: LeagueGetPointsSystems });
  }

  /**
   * membership
   * @see https://members-ng.iracing.com/data/league/membership
   * @sample league.membership.json
   */
  async membership(params?: LeagueMembershipParams): Promise<LeagueMembershipResponse> {
    return this.client.get<LeagueMembershipResponse>("https://members-ng.iracing.com/data/league/membership", { params, paramsValidator: membershipParams, schema: LeagueMembership });
  }

  /**
   * roster
   * @see https://members-ng.iracing.com/data/league/roster
   * @sample league.roster.json
   */
  async roster(params: LeagueRosterParams): Promise<LeagueRosterResponse> {
    return this.client.get<LeagueRosterResponse>("https://members-ng.iracing.com/data/league/roster", { params, paramsValidator: rosterParams, schema: LeagueRoster });
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/league/seasons
   * @sample league.seasons.json
   */
  async seasons(params: LeagueSeasonsParams): Promise<LeagueSeasonsResponse> {
    return this.client.get<LeagueSeasonsResponse>("https://members-ng.iracing.com/data/league/seasons", { params, paramsValidator: seasonsParams, schema: LeagueSeasons });
  }

  /**
   * season_standings
   * @see https://members-ng.iracing.com/data/league/season_standings
   * @sample league.season_standings.json
   */
  async seasonStandings(params: LeagueSeasonStandingsParams): Promise<LeagueSeasonStandingsResponse> {
    return this.client.get<LeagueSeasonStandingsResponse>("https://members-ng.iracing.com/data/league/season_standings", { params, paramsValidator: seasonStandingsParams, schema: LeagueSeasonStandings });
  }

  /**
   * season_sessions
   * @see https://members-ng.iracing.com/data/league/season_sessions
   * @sample league.season_sessions.json
   */
  async seasonSessions(params: LeagueSeasonSessionsParams): Promise<LeagueSeasonSessionsResponse> {
    return this.client.get<LeagueSeasonSessionsResponse>("https://members-ng.iracing.com/data/league/season_sessions", { params, paramsValidator: seasonSessionsParams, schema: LeagueSeasonSessions });
  }

}