import * as z from "zod/mini";

// ---- Response Schemas ----

const SeasonList = z.object({
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
    driverChanges: z.boolean(),
    rookieSeason: z.optional(z.string())
  })),
  seasonYear: z.number()
});
const SeasonRaceGuide = z.object({
  subscribed: z.boolean(),
  sessions: z.array(z.object({
    seasonId: z.number(),
    startTime: z.string(),
    superSession: z.boolean(),
    seriesId: z.number(),
    raceWeekNum: z.number(),
    endTime: z.string(),
    sessionId: z.optional(z.number()),
    entryCount: z.number()
  })),
  blockBeginTime: z.string(),
  blockEndTime: z.string(),
  success: z.boolean()
});
const SeasonSpectatorSubsessionids = z.object({
  eventTypes: z.array(z.number()),
  success: z.boolean(),
  subsessionIds: z.array(z.number())
});
const SeasonSpectatorSubsessionidsDetail = z.object({
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

// ---- Response Types (inferred from schemas) ----

export type SeasonListResponse = z.infer<typeof SeasonList>;
export type SeasonRaceGuideResponse = z.infer<typeof SeasonRaceGuide>;
export type SeasonSpectatorSubsessionidsResponse = z.infer<typeof SeasonSpectatorSubsessionids>;
export type SeasonSpectatorSubsessionidsDetailResponse = z.infer<typeof SeasonSpectatorSubsessionidsDetail>;

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
  SeasonList,
  SeasonRaceGuide,
  SeasonSpectatorSubsessionids,
  SeasonSpectatorSubsessionidsDetail,
};