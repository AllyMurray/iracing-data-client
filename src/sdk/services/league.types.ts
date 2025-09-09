import { z } from "zod-mini";

// ---- Response Types ----

export interface LeagueCustLeagueSessionsResponse {
  mine: boolean;
  subscribed: boolean;
  sequence: number;
  sessions: any[];
  success: boolean;
}

export interface LeagueDirectoryResponse {
  resultsPage: any[]; // maps from: results_page
  success: boolean;
  lowerbound: number;
  upperbound: number;
  rowCount: number; // maps from: row_count
}

export interface LeagueGetResponse {
  leagueId: number; // maps from: league_id
  ownerId: number; // maps from: owner_id
  leagueName: string; // maps from: league_name
  created: string;
  hidden: boolean;
  message: string;
  about: string;
  recruiting: boolean;
  privateWall: boolean; // maps from: private_wall
  privateRoster: boolean; // maps from: private_roster
  privateSchedule: boolean; // maps from: private_schedule
  privateResults: boolean; // maps from: private_results
  isOwner: boolean; // maps from: is_owner
  isAdmin: boolean; // maps from: is_admin
  rosterCount: number; // maps from: roster_count
  owner: any;
  image: any;
  tags: any;
  leagueApplications: any[]; // maps from: league_applications
  pendingRequests: any[]; // maps from: pending_requests
  isMember: boolean; // maps from: is_member
  isApplicant: boolean; // maps from: is_applicant
  isInvite: boolean; // maps from: is_invite
  isIgnored: boolean; // maps from: is_ignored
  roster: any[];
}

export interface LeagueGetPointsSystemsResponse {
  subscribed: boolean;
  success: boolean;
  pointsSystems: any[]; // maps from: points_systems
  leagueId: number; // maps from: league_id
}

export interface LeagueMembershipItem {
  leagueId: number; // maps from: league_id
  leagueName: string; // maps from: league_name
  owner: boolean;
  admin: boolean;
  leagueMailOptOut: boolean; // maps from: league_mail_opt_out
  leaguePmOptOut: boolean; // maps from: league_pm_opt_out
  carNumber: string; // maps from: car_number
  nickName: string; // maps from: nick_name
}

export type LeagueMembershipResponse = LeagueMembershipItem[];

export interface LeagueRosterResponse {
  type: string;
  data: any;
  dataUrl: string; // maps from: data_url
}

export interface LeagueSeasonsResponse {
  subscribed: boolean;
  seasons: any[];
  success: boolean;
  retired: boolean;
  leagueId: number; // maps from: league_id
}

export interface LeagueSeasonStandingsResponse {
  carClassId: number; // maps from: car_class_id
  success: boolean;
  seasonId: number; // maps from: season_id
  carId: number; // maps from: car_id
  standings: any;
  leagueId: number; // maps from: league_id
}

export interface LeagueSeasonSessionsResponse {
  success: boolean;
  subscribed: boolean;
  leagueId: number; // maps from: league_id
  seasonId: number; // maps from: season_id
  sessions: any[];
}

// ---- Parameter Schemas ----

const LeagueCustLeagueSessionsParamsSchema = z.object({
  mine: z.boolean().optional(), // If true, return only sessions created by this user.
  packageId: z.number().optional(), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

const LeagueDirectoryParamsSchema = z.object({
  search: z.string().optional(), // Will search against league name, description, owner, and league ID.
  tag: z.string().optional(), // One or more tags, comma-separated.
  restrictToMember: z.boolean().optional(), // If true include only leagues for which customer is a member. // maps to: restrict_to_member
  restrictToRecruiting: z.boolean().optional(), // If true include only leagues which are recruiting. // maps to: restrict_to_recruiting
  restrictToFriends: z.boolean().optional(), // If true include only leagues owned by a friend. // maps to: restrict_to_friends
  restrictToWatched: z.boolean().optional(), // If true include only leagues owned by a watched member. // maps to: restrict_to_watched
  minimumRosterCount: z.number().optional(), // If set include leagues with at least this number of members. // maps to: minimum_roster_count
  maximumRosterCount: z.number().optional(), // If set include leagues with no more than this number of members. // maps to: maximum_roster_count
  lowerbound: z.number().optional(), // First row of results to return.  Defaults to 1.
  upperbound: z.number().optional(), // Last row of results to return. Defaults to lowerbound + 39.
  sort: z.string().optional(), // One of relevance, leaguename, displayname, rostercount. displayname is owners's name. Defaults to relevance.
  order: z.string().optional(), // One of asc or desc.  Defaults to asc.
});

const LeagueGetParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.boolean().optional(), // For faster responses, only request when necessary. // maps to: include_licenses
});

const LeagueGetPointsSystemsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number().optional(), // If included and the season is using custom points (points_system_id:2) then the custom points option is included in the returned list. Otherwise the custom points option is not returned. // maps to: season_id
});

const LeagueMembershipParamsSchema = z.object({
  custId: z.number().optional(), // If different from the authenticated member, the following restrictions apply: - Caller cannot be on requested customer's block list or an empty list will result; - Requested customer cannot have their online activity preference set to hidden or an empty list will result; - Only leagues for which the requested customer is an admin and the league roster is not private are returned. // maps to: cust_id
  includeLeague: z.boolean().optional(), // maps to: include_league
});

const LeagueRosterParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.boolean().optional(), // For faster responses, only request when necessary. // maps to: include_licenses
});

const LeagueSeasonsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  retired: z.boolean().optional(), // If true include seasons which are no longer active.
});

const LeagueSeasonStandingsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number().optional(), // maps to: car_class_id
  carId: z.number().optional(), // If car_class_id is included then the standings are for the car in that car class, otherwise they are for the car across car classes. // maps to: car_id
});

const LeagueSeasonSessionsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  resultsOnly: z.boolean().optional(), // If true include only sessions for which results are available. // maps to: results_only
});

// ---- Exported Parameter Types ----

export type LeagueCustLeagueSessionsParams = z.infer<typeof LeagueCustLeagueSessionsParamsSchema>;
export type LeagueDirectoryParams = z.infer<typeof LeagueDirectoryParamsSchema>;
export type LeagueGetParams = z.infer<typeof LeagueGetParamsSchema>;
export type LeagueGetPointsSystemsParams = z.infer<typeof LeagueGetPointsSystemsParamsSchema>;
export type LeagueMembershipParams = z.infer<typeof LeagueMembershipParamsSchema>;
export type LeagueRosterParams = z.infer<typeof LeagueRosterParamsSchema>;
export type LeagueSeasonsParams = z.infer<typeof LeagueSeasonsParamsSchema>;
export type LeagueSeasonStandingsParams = z.infer<typeof LeagueSeasonStandingsParamsSchema>;
export type LeagueSeasonSessionsParams = z.infer<typeof LeagueSeasonSessionsParamsSchema>;

// ---- Exported Schemas ----

export {
  LeagueCustLeagueSessionsParamsSchema,
  LeagueDirectoryParamsSchema,
  LeagueGetParamsSchema,
  LeagueGetPointsSystemsParamsSchema,
  LeagueMembershipParamsSchema,
  LeagueRosterParamsSchema,
  LeagueSeasonsParamsSchema,
  LeagueSeasonStandingsParamsSchema,
  LeagueSeasonSessionsParamsSchema,
};