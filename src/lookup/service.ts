import type { IRacingClient } from "../client";
import type { LookupDriversParams, LookupCountriesResponse, LookupDriversResponse, LookupFlairsResponse, LookupGetResponse, LookupLicensesResponse } from "./types";
import * as z from "zod/mini";
import { LookupCountries, LookupDrivers, LookupFlairs, LookupGet, LookupLicenses } from "./types";

const driversParams = z.object({
  searchTerm: z.string(), // A cust_id or partial name for which to search. // maps to: search_term
  leagueId: z.optional(z.number()), // Narrow the search to the roster of the given league. // maps to: league_id
});

export class LookupService {
  constructor(private client: IRacingClient) {}

  /**
   * countries
   * @see https://members-ng.iracing.com/data/lookup/countries
   * @sample lookup.countries.json
   */
  async countries(): Promise<LookupCountriesResponse> {
    return this.client.get<LookupCountriesResponse>("https://members-ng.iracing.com/data/lookup/countries", { schema: LookupCountries });
  }

  /**
   * drivers
   * @see https://members-ng.iracing.com/data/lookup/drivers
   * @sample lookup.drivers.json
   */
  async drivers(params: LookupDriversParams): Promise<LookupDriversResponse> {
    return this.client.get<LookupDriversResponse>("https://members-ng.iracing.com/data/lookup/drivers", { params, paramsValidator: driversParams, schema: LookupDrivers });
  }

  /**
   * flairs
   * @see https://members-ng.iracing.com/data/lookup/flairs
   * @sample lookup.flairs.json
   */
  async flairs(): Promise<LookupFlairsResponse> {
    return this.client.get<LookupFlairsResponse>("https://members-ng.iracing.com/data/lookup/flairs", { schema: LookupFlairs });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/lookup/get
   * @sample lookup.get.json
   */
  async get(): Promise<LookupGetResponse> {
    return this.client.get<LookupGetResponse>("https://members-ng.iracing.com/data/lookup/get", { schema: LookupGet });
  }

  /**
   * licenses
   * @see https://members-ng.iracing.com/data/lookup/licenses
   * @sample lookup.licenses.json
   */
  async licenses(): Promise<LookupLicensesResponse> {
    return this.client.get<LookupLicensesResponse>("https://members-ng.iracing.com/data/lookup/licenses", { schema: LookupLicenses });
  }

}