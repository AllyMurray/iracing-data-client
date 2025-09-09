import * as z from "zod/mini";

// ---- Response Schemas ----

const TeamMembership = z.array(z.object({
  teamId: z.number(),
  teamName: z.string(),
  owner: z.boolean(),
  admin: z.boolean(),
  defaultTeam: z.boolean()
}));

// ---- Response Types (inferred from schemas) ----

export type TeamMembershipResponse = z.infer<typeof TeamMembership>;

// ---- Parameter Schemas ----

const TeamGetParamsSchema = z.object({
  teamId: z.number(), // maps to: team_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
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
  TeamMembership,
};