import * as z from "zod/mini";

// ---- Response Types ----

export interface TeamMembershipItem {
  teamId: number; // maps from: team_id
  teamName: string; // maps from: team_name
  owner: boolean;
  admin: boolean;
  defaultTeam: boolean; // maps from: default_team
}

export type TeamMembershipResponse = TeamMembershipItem[];

// ---- Response Schemas ----

const TeamMembershipSchema = z.array(z.object({
  teamId: z.number(),
  teamName: z.string(),
  owner: z.boolean(),
  admin: z.boolean(),
  defaultTeam: z.boolean()
}));

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
  TeamMembershipSchema,
};