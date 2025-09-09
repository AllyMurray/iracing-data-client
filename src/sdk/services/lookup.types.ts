import { z } from "zod-mini";

// ---- Parameter Schemas ----

const LookupCountriesParamsSchema = z.object({
});

const LookupDriversParamsSchema = z.object({
  search_term: z.string(), // A cust_id or partial name for which to search.
  league_id: z.number().optional(), // Narrow the search to the roster of the given league.
});

const LookupFlairsParamsSchema = z.object({
});

const LookupGetParamsSchema = z.object({
});

const LookupLicensesParamsSchema = z.object({
});

// ---- Exported Types ----

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