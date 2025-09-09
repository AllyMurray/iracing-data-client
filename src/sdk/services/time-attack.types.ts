import { z } from "zod-mini";

// ---- Parameter Schemas ----

const TimeAttackMemberSeasonResultsParamsSchema = z.object({
  ta_comp_season_id: z.number(),
});

// ---- Exported Types ----

export type TimeAttackMemberSeasonResultsParams = z.infer<typeof TimeAttackMemberSeasonResultsParamsSchema>;

// ---- Exported Schemas ----

export {
  TimeAttackMemberSeasonResultsParamsSchema,
};