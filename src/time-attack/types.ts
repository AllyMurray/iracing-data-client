import * as z from "zod/mini";

// ---- Response Schemas ----

const TimeAttackMemberSeasonResults = z.array(z.unknown());

// ---- Response Types (inferred from schemas) ----

export type TimeAttackMemberSeasonResultsResponse = z.infer<typeof TimeAttackMemberSeasonResults>;

// ---- Parameter Validators ----

const timeAttackMemberSeasonResultsParams = z.object({
  taCompSeasonId: z.number(), // maps to: ta_comp_season_id
});

// ---- Exported Parameter Types ----

export type TimeAttackMemberSeasonResultsParams = z.infer<typeof timeAttackMemberSeasonResultsParams>;

// ---- Exported Schemas ----

export {
  TimeAttackMemberSeasonResults,
};