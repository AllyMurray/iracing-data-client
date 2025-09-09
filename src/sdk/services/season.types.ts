import { z } from "zod-mini";

// ---- Parameter Schemas ----

const SeasonListParamsSchema = z.object({
  season_year: z.number(),
  season_quarter: z.number(),
});

const SeasonRaceGuideParamsSchema = z.object({
  from: z.string().optional(), // ISO-8601 offset format. Defaults to the current time. Include sessions with start times up to 3 hours after this time. Times in the past will be rewritten to the current time.
  include_end_after_from: z.boolean().optional(), // Include sessions which start before 'from' but end after.
});

const SeasonSpectatorSubsessionidsParamsSchema = z.object({
  event_types: z.array(z.number()).optional(), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5
});

const SeasonSpectatorSubsessionidsDetailParamsSchema = z.object({
  event_types: z.array(z.number()).optional(), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5
  season_ids: z.array(z.number()).optional(), // Seasons to include in the search. Defaults to all. ?season_ids=513,937
});

// ---- Exported Types ----

export type SeasonListParams = z.infer<typeof SeasonListParamsSchema>;
export type SeasonRaceGuideParams = z.infer<typeof SeasonRaceGuideParamsSchema>;
export type SeasonSpectatorSubsessionidsParams = z.infer<typeof SeasonSpectatorSubsessionidsParamsSchema>;
export type SeasonSpectatorSubsessionidsDetailParams = z.infer<typeof SeasonSpectatorSubsessionidsDetailParamsSchema>;

// ---- Exported Schemas ----

export {
  SeasonListParamsSchema,
  SeasonRaceGuideParamsSchema,
  SeasonSpectatorSubsessionidsParamsSchema,
  SeasonSpectatorSubsessionidsDetailParamsSchema,
};