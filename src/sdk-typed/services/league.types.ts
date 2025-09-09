import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const LeagueCustLeagueSessionsParamsSchema = z.object({
  mine: z.boolean().optional(), // If true, return only sessions created by this user.
  package_id: z.number().optional(), // If set, return only sessions using this car or track package ID.
});

const LeagueDirectoryParamsSchema = z.object({
  search: z.string().optional(), // Will search against league name, description, owner, and league ID.
  tag: z.string().optional(), // One or more tags, comma-separated.
  restrict_to_member: z.boolean().optional(), // If true include only leagues for which customer is a member.
  restrict_to_recruiting: z.boolean().optional(), // If true include only leagues which are recruiting.
  restrict_to_friends: z.boolean().optional(), // If true include only leagues owned by a friend.
  restrict_to_watched: z.boolean().optional(), // If true include only leagues owned by a watched member.
  minimum_roster_count: z.number().optional(), // If set include leagues with at least this number of members.
  maximum_roster_count: z.number().optional(), // If set include leagues with no more than this number of members.
  lowerbound: z.number().optional(), // First row of results to return.  Defaults to 1.
  upperbound: z.number().optional(), // Last row of results to return. Defaults to lowerbound + 39.
  sort: z.string().optional(), // One of relevance, leaguename, displayname, rostercount. displayname is owners's name. Defaults to relevance.
  order: z.string().optional(), // One of asc or desc.  Defaults to asc.
});

const LeagueGetParamsSchema = z.object({
  league_id: z.number(),
  include_licenses: z.boolean().optional(), // For faster responses, only request when necessary.
});

const LeagueGetPointsSystemsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number().optional(), // If included and the season is using custom points (points_system_id:2) then the custom points option is included in the returned list. Otherwise the custom points option is not returned.
});

const LeagueMembershipParamsSchema = z.object({
  cust_id: z.number().optional(), // If different from the authenticated member, the following restrictions apply: - Caller cannot be on requested customer's block list or an empty list will result; - Requested customer cannot have their online activity preference set to hidden or an empty list will result; - Only leagues for which the requested customer is an admin and the league roster is not private are returned.
  include_league: z.boolean().optional(),
});

const LeagueRosterParamsSchema = z.object({
  league_id: z.number(),
  include_licenses: z.boolean().optional(), // For faster responses, only request when necessary.
});

const LeagueSeasonsParamsSchema = z.object({
  league_id: z.number(),
  retired: z.boolean().optional(), // If true include seasons which are no longer active.
});

const LeagueSeasonStandingsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number(),
  car_class_id: z.number().optional(),
  car_id: z.number().optional(), // If car_class_id is included then the standings are for the car in that car class, otherwise they are for the car across car classes.
});

const LeagueSeasonSessionsParamsSchema = z.object({
  league_id: z.number(),
  season_id: z.number(),
  results_only: z.boolean().optional(), // If true include only sessions for which results are available.
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