import * as z from "zod-mini";

// ---- Response Types ----

export interface StatsMemberBestsResponse {
  carsDriven: any[]; // maps from: cars_driven
  bests: any[];
  custId: number; // maps from: cust_id
  carId: number; // maps from: car_id
}

export interface StatsMemberCareerResponse {
  stats: any[];
  custId: number; // maps from: cust_id
}

export interface StatsMemberRecapResponse {
  year: number;
  stats: any;
  success: boolean;
  season: null;
  custId: number; // maps from: cust_id
}

export interface StatsMemberRecentRacesResponse {
  races: any[];
  custId: number; // maps from: cust_id
}

export interface StatsMemberSummaryResponse {
  thisYear: any; // maps from: this_year
  custId: number; // maps from: cust_id
}

export interface StatsMemberYearlyResponse {
  stats: any[];
  custId: number; // maps from: cust_id
}

export interface StatsWorldRecordsResponse {
  type: string;
  data: any;
}

// ---- Parameter Schemas ----

const StatsMemberBestsParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  carId: z.optional(z.number()), // First call should exclude car_id; use cars_driven list in return for subsequent calls. // maps to: car_id
});

const StatsMemberCareerParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const StatsMemberDivisionParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  eventType: z.number(), // The event type code for the division type: 4 - Time Trial; 5 - Race // maps to: event_type
});

const StatsMemberRecapParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  year: z.optional(z.number()), // Season year; if not supplied the current calendar year (UTC) is used.
  season: z.optional(z.number()), // Season (quarter) within the year; if not supplied the recap will be fore the entire year.
});

const StatsMemberRecentRacesParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const StatsMemberSummaryParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const StatsMemberYearlyParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const StatsSeasonDriverStandingsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  division: z.optional(z.number()), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

const StatsSeasonSupersessionStandingsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  division: z.optional(z.number()), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

const StatsSeasonTeamStandingsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

const StatsSeasonTtStandingsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  division: z.optional(z.number()), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

const StatsSeasonTtResultsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  raceWeekNum: z.number(), // The first race week of a season is 0. // maps to: race_week_num
  division: z.optional(z.number()), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
});

const StatsSeasonQualifyResultsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  carClassId: z.number(), // maps to: car_class_id
  raceWeekNum: z.number(), // The first race week of a season is 0. // maps to: race_week_num
  division: z.optional(z.number()), // Divisions are 0-based: 0 is Division 1, 10 is Rookie. See /data/constants/divisons for more information. Defaults to all.
});

const StatsWorldRecordsParamsSchema = z.object({
  carId: z.number(), // maps to: car_id
  trackId: z.number(), // maps to: track_id
  seasonYear: z.optional(z.number()), // Limit best times to a given year. // maps to: season_year
  seasonQuarter: z.optional(z.number()), // Limit best times to a given quarter; only applicable when year is used. // maps to: season_quarter
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