import * as z from "zod/mini";

// ---- Response Types ----

export type TimeAttackMemberSeasonResultsResponse = Array<any>;

// ---- Response Schemas ----

const TimeAttackMemberSeasonResultsSchema = z.array(z.unknown());

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