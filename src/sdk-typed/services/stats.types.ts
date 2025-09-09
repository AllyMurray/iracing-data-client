import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const StatsMemberBestsParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
  car_id: z.number().optional(), // First call should exclude car_id; use cars_driven list in return for subsequent calls.
});

const StatsMemberCareerParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

const StatsMemberDivisionParamsSchema = z.object({
  season_id: z.number(),
  event_type: z.number(), // The event type code for the division type: 4 - Time Trial; 5 - Race
});

const StatsMemberRecapParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
  year: z.number().optional(), // Season year; if not supplied the current calendar year (UTC) is used.
  season: z.number().optional(), // Season (quarter) within the year; if not supplied the recap will be fore the entire year.
});

const StatsMemberRecentRacesParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

const StatsMemberSummaryParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

const StatsMemberYearlyParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

const StatsSeasonDriverStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  race_week_num: z.number().optional(), // The first race week of a season is 0.
});

const StatsSeasonSupersessionStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  race_week_num: z.number().optional(), // The first race week of a season is 0.
});

const StatsSeasonTeamStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number().optional(), // The first race week of a season is 0.
});

const StatsSeasonTtStandingsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  division: z.number().optional(), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  race_week_num: z.number().optional(), // The first race week of a season is 0.
});

const StatsSeasonTtResultsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number(), // The first race week of a season is 0.
  division: z.number().optional(), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
});

const StatsSeasonQualifyResultsParamsSchema = z.object({
  season_id: z.number(),
  car_class_id: z.number(),
  race_week_num: z.number(), // The first race week of a season is 0.
  division: z.number().optional(), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
});

const StatsWorldRecordsParamsSchema = z.object({
  car_id: z.number(),
  track_id: z.number(),
  season_year: z.number().optional(), // Limit best times to a given year.
  season_quarter: z.number().optional(), // Limit best times to a given quarter; only applicable when year is used.
});

// ---- Exported Parameter Types ----

export type StatsMemberBestsParams = z.infer<typeof StatsMemberBestsParamsSchema>;
export type StatsMemberCareerParams = z.infer<typeof StatsMemberCareerParamsSchema>;
export type StatsMemberDivisionParams = z.infer<typeof StatsMemberDivisionParamsSchema>;
export type StatsMemberRecapParams = z.infer<typeof StatsMemberRecapParamsSchema>;
export type StatsMemberRecentRacesParams = z.infer<typeof StatsMemberRecentRacesParamsSchema>;
export type StatsMemberSummaryParams = z.infer<typeof StatsMemberSummaryParamsSchema>;
export type StatsMemberYearlyParams = z.infer<typeof StatsMemberYearlyParamsSchema>;
export type StatsSeasonDriverStandingsParams = z.infer<typeof StatsSeasonDriverStandingsParamsSchema>;
export type StatsSeasonSupersessionStandingsParams = z.infer<typeof StatsSeasonSupersessionStandingsParamsSchema>;
export type StatsSeasonTeamStandingsParams = z.infer<typeof StatsSeasonTeamStandingsParamsSchema>;
export type StatsSeasonTtStandingsParams = z.infer<typeof StatsSeasonTtStandingsParamsSchema>;
export type StatsSeasonTtResultsParams = z.infer<typeof StatsSeasonTtResultsParamsSchema>;
export type StatsSeasonQualifyResultsParams = z.infer<typeof StatsSeasonQualifyResultsParamsSchema>;
export type StatsWorldRecordsParams = z.infer<typeof StatsWorldRecordsParamsSchema>;

// ---- Exported Schemas ----

export {
  StatsMemberBestsParamsSchema,
  StatsMemberCareerParamsSchema,
  StatsMemberDivisionParamsSchema,
  StatsMemberRecapParamsSchema,
  StatsMemberRecentRacesParamsSchema,
  StatsMemberSummaryParamsSchema,
  StatsMemberYearlyParamsSchema,
  StatsSeasonDriverStandingsParamsSchema,
  StatsSeasonSupersessionStandingsParamsSchema,
  StatsSeasonTeamStandingsParamsSchema,
  StatsSeasonTtStandingsParamsSchema,
  StatsSeasonTtResultsParamsSchema,
  StatsSeasonQualifyResultsParamsSchema,
  StatsWorldRecordsParamsSchema,
};