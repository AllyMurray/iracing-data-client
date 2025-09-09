import { z } from "zod-mini";

// ---- Parameter Schemas ----

const TeamGetParamsSchema = z.object({
  team_id: z.number(),
  include_licenses: z.boolean().optional(), // For faster responses, only request when necessary.
});

const TeamMembershipParamsSchema = z.object({
});

// ---- Exported Types ----

export type TeamGetParams = z.infer<typeof TeamGetParamsSchema>;
export type TeamMembershipParams = z.infer<typeof TeamMembershipParamsSchema>;

// ---- Exported Schemas ----

export {
  TeamGetParamsSchema,
  TeamMembershipParamsSchema,
};