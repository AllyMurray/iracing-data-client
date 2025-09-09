import * as z from "zod/mini";

// ---- Response Types ----

export interface LookupCountriesItem {
  countryName: string; // maps from: country_name
  countryCode: string; // maps from: country_code
}

export type LookupCountriesResponse = LookupCountriesItem[];

export interface LookupDriversItem {
  custId: number; // maps from: cust_id
  displayName: string; // maps from: display_name
  helmet: any;
  profileDisabled: boolean; // maps from: profile_disabled
}

export type LookupDriversResponse = LookupDriversItem[];

export interface LookupFlairsResponse {
  flairs: any[];
  success: boolean;
}

export type LookupGetResponse = any[];

export interface LookupLicensesItem {
  licenseGroup: number; // maps from: license_group
  groupName: string | ""; // maps from: group_name
  minNumRaces: number; // maps from: min_num_races
  participationCredits: number; // maps from: participation_credits
  minSrToFastTrack: number; // maps from: min_sr_to_fast_track
  levels: any[];
  minNumTt: number; // maps from: min_num_tt
}

export type LookupLicensesResponse = LookupLicensesItem[];

// ---- Response Schemas ----

const LookupCountriesSchema = z.array(z.object({
  countryName: z.string(),
  countryCode: z.string()
}));

const LookupDriversSchema = z.array(z.object({
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
  profileDisabled: z.boolean()
}));

const LookupFlairsSchema = z.object({
  flairs: z.array(z.object({
  flairId: z.number(),
  flairName: z.string(),
  seq: z.number()
})),
  success: z.boolean()
});

const LookupGetSchema = z.array(z.unknown());

const LookupLicensesSchema = z.array(z.object({
  licenseGroup: z.number(),
  groupName: z.union([z.string(), z.literal("")]),
  minNumRaces: z.number(),
  participationCredits: z.number(),
  minSrToFastTrack: z.number(),
  levels: z.array(z.object({
  licenseId: z.number(),
  licenseGroup: z.number(),
  license: z.string(),
  shortName: z.string(),
  licenseLetter: z.string(),
  color: z.string()
})),
  minNumTt: z.number()
}));

// ---- Parameter Schemas ----

const LookupCountriesParamsSchema = z.object({
});

const LookupDriversParamsSchema = z.object({
  searchTerm: z.string(), // A cust_id or partial name for which to search. // maps to: search_term
  leagueId: z.optional(z.number()), // Narrow the search to the roster of the given league. // maps to: league_id
});

const LookupFlairsParamsSchema = z.object({
});

const LookupGetParamsSchema = z.object({
});

const LookupLicensesParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type LookupCountriesParams = z.infer<typeof LookupCountriesParamsSchema>;
export type LookupDriversParams = z.infer<typeof LookupDriversParamsSchema>;
export type LookupFlairsParams = z.infer<typeof LookupFlairsParamsSchema>;
export type LookupGetParams = z.infer<typeof LookupGetParamsSchema>;
export type LookupLicensesParams = z.infer<typeof LookupLicensesParamsSchema>;

// ---- Exported Schemas ----

export {
  LookupCountriesParamsSchema,
  LookupDriversParamsSchema,
  LookupFlairsParamsSchema,
  LookupGetParamsSchema,
  LookupLicensesParamsSchema,
  LookupCountriesSchema,
  LookupDriversSchema,
  LookupFlairsSchema,
  LookupGetSchema,
  LookupLicensesSchema,
};