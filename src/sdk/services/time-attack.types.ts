import * as z from "zod-mini";

// ---- Response Types ----

export type TimeAttackMemberSeasonResultsResponse = any[];

// ---- Parameter Schemas ----

const TimeAttackMemberSeasonResultsParamsSchema = z.object({
  taCompSeasonId: z.number(), // maps to: ta_comp_season_id
});

// ---- Exported Parameter Types ----

export type TimeAttackMemberSeasonResultsParams = z.infer<typeof TimeAttackMemberSeasonResultsParamsSchema>;

// ---- Exported Schemas ----

export {
  TimeAttackMemberSeasonResultsParamsSchema,
};