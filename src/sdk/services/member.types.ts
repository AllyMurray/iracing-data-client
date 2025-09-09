import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const MemberAwardsParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
});

const MemberAwardInstancesParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
  awardId: z.number(), // maps to: award_id
});

const MemberChartDataParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
  categoryId: z.number(), // 1 - Oval; 2 - Road; 3 - Dirt oval; 4 - Dirt road // maps to: category_id
  chartType: z.number(), // 1 - iRating; 2 - TT Rating; 3 - License/SR // maps to: chart_type
});

const MemberGetParamsSchema = z.object({
  custIds: z.array(z.number()), // ?cust_ids=2,3,4 // maps to: cust_ids
  includeLicenses: z.boolean().optional(), // maps to: include_licenses
});

const MemberInfoParamsSchema = z.object({
});

const MemberParticipationCreditsParamsSchema = z.object({
});

const MemberProfileParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
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