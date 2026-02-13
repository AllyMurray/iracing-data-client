import * as z from "zod/mini";

// ---- Response Schemas ----

const TeamGet = z.object({
  teamId: z.number(),
  ownerId: z.number(),
  teamName: z.string(),
  created: z.string(),
  hidden: z.boolean(),
  message: z.string(),
  about: z.string(),
  url: z.string(),
  rosterCount: z.number(),
  recruiting: z.boolean(),
  privateWall: z.boolean(),
  isDefault: z.boolean(),
  isOwner: z.boolean(),
  isAdmin: z.boolean(),
  suit: z.object({
    pattern: z.number(),
    color1: z.string(),
    color2: z.string(),
    color3: z.string()
  }),
  owner: z.object({
    custId: z.number(),
    displayName: z.string(),
    helmet: z.object({
      pattern: z.number(),
      color1: z.string(),
      color2: z.string(),
      color3: z.string(),
      faceType: z.number(),
      helmetType: z.number()
    }),
    owner: z.boolean(),
    admin: z.boolean()
  }),
  tags: z.object({
    categorized: z.array(z.unknown()),
    notCategorized: z.array(z.unknown())
  }),
  teamApplications: z.array(z.unknown()),
  pendingRequests: z.array(z.unknown()),
  isMember: z.boolean(),
  isApplicant: z.boolean(),
  isInvite: z.boolean(),
  isIgnored: z.boolean(),
  roster: z.array(z.object({
    custId: z.number(),
    displayName: z.string(),
    helmet: z.object({
      pattern: z.number(),
      color1: z.string(),
      color2: z.string(),
      color3: z.string(),
      faceType: z.number(),
      helmetType: z.number()
    }),
    owner: z.boolean(),
    admin: z.boolean()
  }))
});
const TeamMembership = z.array(z.object({
  teamId: z.number(),
  teamName: z.string(),
  owner: z.boolean(),
  admin: z.boolean(),
  defaultTeam: z.boolean()
}));

// ---- Response Types (inferred from schemas) ----

export type TeamGetResponse = z.infer<typeof TeamGet>;
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
  TeamGet,
  TeamMembership,
};