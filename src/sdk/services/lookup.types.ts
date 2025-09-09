import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const LookupCountriesParamsSchema = z.object({
});

const LookupDriversParamsSchema = z.object({
  searchTerm: z.string(), // A cust_id or partial name for which to search. // maps to: search_term
  leagueId: z.number().optional(), // Narrow the search to the roster of the given league. // maps to: league_id
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