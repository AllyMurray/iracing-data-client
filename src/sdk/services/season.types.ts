import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const SeasonListParamsSchema = z.object({
  seasonYear: z.number(), // maps to: season_year
  seasonQuarter: z.number(), // maps to: season_quarter
});

const SeasonRaceGuideParamsSchema = z.object({
  from: z.string().optional(), // ISO-8601 offset format. Defaults to the current time. Include sessions with start times up to 3 hours after this time. Times in the past will be rewritten to the current time.
  includeEndAfterFrom: z.boolean().optional(), // Include sessions which start before 'from' but end after. // maps to: include_end_after_from
});

const SeasonSpectatorSubsessionidsParamsSchema = z.object({
  eventTypes: z.array(z.number()).optional(), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
});

const SeasonSpectatorSubsessionidsDetailParamsSchema = z.object({
  eventTypes: z.array(z.number()).optional(), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
  seasonIds: z.array(z.number()).optional(), // Seasons to include in the search. Defaults to all. ?season_ids=513,937 // maps to: season_ids
});

// ---- Exported Parameter Types ----

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