import * as z from "zod-mini";

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
  groupName: string; // maps from: group_name
  minNumRaces: number; // maps from: min_num_races
  participationCredits: number; // maps from: participation_credits
  minSrToFastTrack: number; // maps from: min_sr_to_fast_track
  levels: any[];
  minNumTt: number; // maps from: min_num_tt
}

export type LookupLicensesResponse = LookupLicensesItem[];

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
};