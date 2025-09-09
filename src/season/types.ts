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

// ---- Response Schemas ----

const SeasonListSchema = z.object({
  seasonQuarter: z.number(),
  seasons: z.array(z.object({
  seasonId: z.number(),
  seriesId: z.number(),
  seasonName: z.string(),
  seriesName: z.string(),
  official: z.boolean(),
  seasonYear: z.number(),
  seasonQuarter: z.number(),
  licenseGroup: z.number(),
  fixedSetup: z.boolean(),
  driverChanges: z.boolean()
})),
  seasonYear: z.number()
});

const SeasonRaceGuideSchema = z.object({
  subscribed: z.boolean(),
  sessions: z.array(z.object({
  seasonId: z.number(),
  startTime: z.string(),
  superSession: z.boolean(),
  seriesId: z.number(),
  raceWeekNum: z.number(),
  endTime: z.string(),
  sessionId: z.number(),
  entryCount: z.number()
})),
  blockBeginTime: z.string(),
  blockEndTime: z.string(),
  success: z.boolean()
});

const SeasonSpectatorSubsessionidsSchema = z.object({
  eventTypes: z.array(z.number()),
  success: z.boolean(),
  subsessionIds: z.array(z.number())
});

const SeasonSpectatorSubsessionidsDetailSchema = z.object({
  success: z.boolean(),
  seasonIds: z.array(z.number()),
  eventTypes: z.array(z.number()),
  subsessions: z.array(z.object({
  subsessionId: z.number(),
  sessionId: z.number(),
  seasonId: z.number(),
  startTime: z.string(),
  raceWeekNum: z.number(),
  eventType: z.number()
}))
});

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
  SeasonListSchema,
  SeasonRaceGuideSchema,
  SeasonSpectatorSubsessionidsSchema,
  SeasonSpectatorSubsessionidsDetailSchema,
};