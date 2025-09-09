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
  flairs: z.array(z.object({
    flairId: z.number(),
    flairName: z.string(),
    seq: z.number()
  })),
  success: z.boolean()
});
const LookupGet = z.array(z.unknown());
const LookupLicenses = z.array(z.object({
  licenseGroup: z.number(),
  groupName: z.optional(z.union([z.string(), z.null()])),
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

// ---- Response Types (inferred from schemas) ----

export type LookupCountriesResponse = z.infer<typeof LookupCountries>;
export type LookupDriversResponse = z.infer<typeof LookupDrivers>;
export type LookupFlairsResponse = z.infer<typeof LookupFlairs>;
export type LookupGetResponse = z.infer<typeof LookupGet>;
export type LookupLicensesResponse = z.infer<typeof LookupLicenses>;

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
  LookupCountries,
  LookupDrivers,
  LookupFlairs,
  LookupGet,
  LookupLicenses,
};