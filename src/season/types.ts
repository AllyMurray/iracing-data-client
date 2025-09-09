import * as z from "zod/mini";

// ---- Response Types ----

export interface SeasonListResponse {
  seasonQuarter: number; // maps from: season_quarter
  seasons: any[];
  seasonYear: number; // maps from: season_year
}

export interface SeasonRaceGuideResponse {
  subscribed: boolean;
  sessions: any[];
  blockBeginTime: string; // maps from: block_begin_time
  blockEndTime: string; // maps from: block_end_time
  success: boolean;
}

export interface SeasonSpectatorSubsessionidsResponse {
  eventTypes: number[]; // maps from: event_types
  success: boolean;
  subsessionIds: number[]; // maps from: subsession_ids
}

export interface SeasonSpectatorSubsessionidsDetailResponse {
  success: boolean;
  seasonIds: number[]; // maps from: season_ids
  eventTypes: number[]; // maps from: event_types
  subsessions: any[];
}

// ---- Parameter Schemas ----

const SeasonListParamsSchema = z.object({
  seasonYear: z.number(), // maps to: season_year
  seasonQuarter: z.number(), // maps to: season_quarter
});

const SeasonRaceGuideParamsSchema = z.object({
  from: z.optional(z.string()), // ISO-8601 offset format. Defaults to the current time. Include sessions with start times up to 3 hours after this time. Times in the past will be rewritten to the current time.
  includeEndAfterFrom: z.optional(z.boolean()), // Include sessions which start before 'from' but end after. // maps to: include_end_after_from
});

const SeasonSpectatorSubsessionidsParamsSchema = z.object({
  eventTypes: z.optional(z.array(z.number())), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
});

const SeasonSpectatorSubsessionidsDetailParamsSchema = z.object({
  eventTypes: z.optional(z.array(z.number())), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
  seasonIds: z.optional(z.array(z.number())), // Seasons to include in the search. Defaults to all. ?season_ids=513,937 // maps to: season_ids
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