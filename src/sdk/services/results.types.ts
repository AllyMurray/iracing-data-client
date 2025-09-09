import { z } from "zod-mini";

// ---- Parameter Schemas ----

const ResultsGetParamsSchema = z.object({
  subsession_id: z.number(),
  include_licenses: z.boolean().optional(),
});

const ResultsEventLogParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(), // The main event is 0; the preceding event is -1, and so on.
});

const ResultsLapChartDataParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(), // The main event is 0; the preceding event is -1, and so on.
});

const ResultsLapDataParamsSchema = z.object({
  subsession_id: z.number(),
  simsession_number: z.number(), // The main event is 0; the preceding event is -1, and so on.
  cust_id: z.number().optional(), // Required if the subsession was a single-driver event. Optional for team events. If omitted for a team event then the laps driven by all the team's drivers will be included.
  team_id: z.number().optional(), // Required if the subsession was a team event.
});

const ResultsSearchHostedParamsSchema = z.object({
  start_range_begin: z.string().optional(), // Session start times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z".
  start_range_end: z.string().optional(), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if start_range_begin is less than 90 days in the past.
  finish_range_begin: z.string().optional(), // Session finish times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z".
  finish_range_end: z.string().optional(), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if finish_range_begin is less than 90 days in the past.
  cust_id: z.number().optional(), // The participant's customer ID. Ignored if team_id is supplied.
  team_id: z.number().optional(), // The team ID to search for. Takes priority over cust_id if both are supplied.
  host_cust_id: z.number().optional(), // The host's customer ID.
  session_name: z.string().optional(), // Part or all of the session's name.
  league_id: z.number().optional(), // Include only results for the league with this ID.
  league_season_id: z.number().optional(), // Include only results for the league season with this ID.
  car_id: z.number().optional(), // One of the cars used by the session.
  track_id: z.number().optional(), // The ID of the track used by the session.
  category_ids: z.array(z.number()).optional(), // Track categories to include in the search.  Defaults to all. ?category_ids=1,2,3,4
});

const ResultsSearchSeriesParamsSchema = z.object({
  season_year: z.number().optional(), // Required when using season_quarter.
  season_quarter: z.number().optional(), // Required when using season_year.
  start_range_begin: z.string().optional(), // Session start times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z".
  start_range_end: z.string().optional(), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if start_range_begin is less than 90 days in the past.
  finish_range_begin: z.string().optional(), // Session finish times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z".
  finish_range_end: z.string().optional(), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if finish_range_begin is less than 90 days in the past.
  cust_id: z.number().optional(), // Include only sessions in which this customer participated. Ignored if team_id is supplied.
  team_id: z.number().optional(), // Include only sessions in which this team participated. Takes priority over cust_id if both are supplied.
  series_id: z.number().optional(), // Include only sessions for series with this ID.
  race_week_num: z.number().optional(), // Include only sessions with this race week number.
  official_only: z.boolean().optional(), // If true, include only sessions earning championship points. Defaults to all.
  event_types: z.array(z.number()).optional(), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5
  category_ids: z.array(z.number()).optional(), // License categories to include in the search.  Defaults to all. ?category_ids=1,2,3,4
});

const ResultsSeasonResultsParamsSchema = z.object({
  season_id: z.number(),
  event_type: z.number().optional(), // Retrict to one event type: 2 - Practice; 3 - Qualify; 4 - Time Trial; 5 - Race
  race_week_num: z.number().optional(), // The first race week of a season is 0.
});

// ---- Exported Types ----

export type ResultsGetParams = z.infer<typeof ResultsGetParamsSchema>;
export type ResultsEventLogParams = z.infer<typeof ResultsEventLogParamsSchema>;
export type ResultsLapChartDataParams = z.infer<typeof ResultsLapChartDataParamsSchema>;
export type ResultsLapDataParams = z.infer<typeof ResultsLapDataParamsSchema>;
export type ResultsSearchHostedParams = z.infer<typeof ResultsSearchHostedParamsSchema>;
export type ResultsSearchSeriesParams = z.infer<typeof ResultsSearchSeriesParamsSchema>;
export type ResultsSeasonResultsParams = z.infer<typeof ResultsSeasonResultsParamsSchema>;

// ---- Exported Schemas ----

export {
  ResultsGetParamsSchema,
  ResultsEventLogParamsSchema,
  ResultsLapChartDataParamsSchema,
  ResultsLapDataParamsSchema,
  ResultsSearchHostedParamsSchema,
  ResultsSearchSeriesParamsSchema,
  ResultsSeasonResultsParamsSchema,
};