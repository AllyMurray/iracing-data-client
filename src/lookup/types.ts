import * as z from "zod/mini";

// ---- Response Schemas ----

const LookupCountries = z.array(z.object({
  countryName: z.string(),
  countryCode: z.string()
}));
const LookupDrivers = z.array(z.object({
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
const LookupFlairs = z.object({
  success: z.boolean(),
  flairs: z.array(z.object({
    flairId: z.number(),
    flairName: z.string(),
    seq: z.number(),
    flairShortname: z.optional(z.string()),
    countryCode: z.optional(z.string())
  }))
});
const LookupGet = z.array(z.object({
  lookups: z.array(z.unknown()),
  tag: z.string()
}));
const LookupLicenses = z.array(z.object({
  licenseGroup: z.number(),
  groupName: z.string(),
  minNumRaces: z.nullable(z.number()),
  participationCredits: z.number(),
  minSrToFastTrack: z.nullable(z.number()),
  levels: z.array(z.object({
    licenseId: z.number(),
    licenseGroup: z.number(),
    license: z.string(),
    shortName: z.string(),
    licenseLetter: z.string(),
    color: z.string()
  })),
  minNumTt: z.nullable(z.number())
}));

// ---- Response Types (inferred from schemas) ----

export type LookupCountriesResponse = z.infer<typeof LookupCountries>;
export type LookupDriversResponse = z.infer<typeof LookupDrivers>;
export type LookupFlairsResponse = z.infer<typeof LookupFlairs>;
export type LookupGetResponse = z.infer<typeof LookupGet>;
export type LookupLicensesResponse = z.infer<typeof LookupLicenses>;

// ---- Parameter Validators ----

const lookupCountriesParams = z.object({
});

const lookupDriversParams = z.object({
  searchTerm: z.string(), // A cust_id or partial name for which to search. // maps to: search_term
  leagueId: z.optional(z.number()), // Narrow the search to the roster of the given league. // maps to: league_id
});

const lookupFlairsParams = z.object({
});

const lookupGetParams = z.object({
});

const lookupLicensesParams = z.object({
});

// ---- Exported Parameter Types ----

export type LookupCountriesParams = z.infer<typeof lookupCountriesParams>;
export type LookupDriversParams = z.infer<typeof lookupDriversParams>;
export type LookupFlairsParams = z.infer<typeof lookupFlairsParams>;
export type LookupGetParams = z.infer<typeof lookupGetParams>;
export type LookupLicensesParams = z.infer<typeof lookupLicensesParams>;

// ---- Exported Schemas ----

export {
  LookupCountries,
  LookupDrivers,
  LookupFlairs,
  LookupGet,
  LookupLicenses,
};