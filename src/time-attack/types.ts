import * as z from "zod/mini";

// ---- Response Schemas ----

const TimeAttackMemberSeasonResultsSchema = z.array(z.unknown());

// ---- Response Types (inferred from schemas) ----

export type TimeAttackMemberSeasonResultsResponse = z.infer<typeof TimeAttackMemberSeasonResultsSchema>;

// ---- Parameter Schemas ----

const TimeAttackMemberSeasonResultsParamsSchema = z.object({
  taCompSeasonId: z.number(), // maps to: ta_comp_season_id
});

// ---- Exported Parameter Types ----

export type TimeAttackMemberSeasonResultsParams = z.infer<typeof TimeAttackMemberSeasonResultsParamsSchema>;

// ---- Exported Schemas ----

export {
  TimeAttackMemberSeasonResultsParamsSchema,
  TimeAttackMemberSeasonResultsSchema,
};