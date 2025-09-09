import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const TeamGetParamsSchema = z.object({
  teamId: z.number(), // maps to: team_id
  includeLicenses: z.boolean().optional(), // For faster responses, only request when necessary. // maps to: include_licenses
});

const TeamMembershipParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type TeamGetParams = z.infer<typeof TeamGetParamsSchema>;
export type TeamMembershipParams = z.infer<typeof TeamMembershipParamsSchema>;

// ---- Exported Schemas ----

export {
  TeamGetParamsSchema,
  TeamMembershipParamsSchema,
};