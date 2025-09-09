import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const MemberAwardsParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

const MemberAwardInstancesParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
  award_id: z.number(),
});

const MemberChartDataParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
  category_id: z.number(), // 1 - Oval; 2 - Road; 3 - Dirt oval; 4 - Dirt road
  chart_type: z.number(), // 1 - iRating; 2 - TT Rating; 3 - License/SR
});

const MemberGetParamsSchema = z.object({
  cust_ids: z.array(z.number()), // ?cust_ids=2,3,4
  include_licenses: z.boolean().optional(),
});

const MemberInfoParamsSchema = z.object({
});

const MemberParticipationCreditsParamsSchema = z.object({
});

const MemberProfileParamsSchema = z.object({
  cust_id: z.number().optional(), // Defaults to the authenticated member.
});

// ---- Exported Parameter Types ----

export type MemberAwardsParams = z.infer<typeof MemberAwardsParamsSchema>;
export type MemberAwardInstancesParams = z.infer<typeof MemberAwardInstancesParamsSchema>;
export type MemberChartDataParams = z.infer<typeof MemberChartDataParamsSchema>;
export type MemberGetParams = z.infer<typeof MemberGetParamsSchema>;
export type MemberInfoParams = z.infer<typeof MemberInfoParamsSchema>;
export type MemberParticipationCreditsParams = z.infer<typeof MemberParticipationCreditsParamsSchema>;
export type MemberProfileParams = z.infer<typeof MemberProfileParamsSchema>;

// ---- Exported Schemas ----

export {
  MemberAwardsParamsSchema,
  MemberAwardInstancesParamsSchema,
  MemberChartDataParamsSchema,
  MemberGetParamsSchema,
  MemberInfoParamsSchema,
  MemberParticipationCreditsParamsSchema,
  MemberProfileParamsSchema,
};