import type { IRacingClient } from "../client";
import type { LookupCountriesParams, LookupDriversParams, LookupFlairsParams, LookupGetParams, LookupLicensesParams, LookupCountriesResponse, LookupDriversResponse, LookupFlairsResponse, LookupGetResponse, LookupLicensesResponse } from "./types";
import { LookupCountriesSchema, LookupDriversSchema, LookupFlairsSchema, LookupGetSchema, LookupLicensesSchema } from "./types";

export class LookupService {
  constructor(private client: IRacingClient) {}

  /**
   * countries
   * @see https://members-ng.iracing.com/data/lookup/countries
   * @sample lookup.countries.json
   */
  async countries(): Promise<LookupCountriesResponse> {
    return this.client.get<LookupCountriesResponse>("https://members-ng.iracing.com/data/lookup/countries", { schema: LookupCountriesSchema });
  }

  /**
   * drivers
   * @see https://members-ng.iracing.com/data/lookup/drivers
   * @sample lookup.drivers.json
   */
  async drivers(params: LookupDriversParams): Promise<LookupDriversResponse> {
    return this.client.get<LookupDriversResponse>("https://members-ng.iracing.com/data/lookup/drivers", { params, schema: LookupDriversSchema as any });
  }

  /**
   * flairs
   * @see https://members-ng.iracing.com/data/lookup/flairs
   * @sample lookup.flairs.json
   */
  async flairs(): Promise<LookupFlairsResponse> {
    return this.client.get<LookupFlairsResponse>("https://members-ng.iracing.com/data/lookup/flairs", { schema: LookupFlairsSchema });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/lookup/get
   * @sample lookup.get.json
   */
  async get(): Promise<LookupGetResponse> {
    return this.client.get<LookupGetResponse>("https://members-ng.iracing.com/data/lookup/get", { schema: LookupGetSchema });
  }

  /**
   * licenses
   * @see https://members-ng.iracing.com/data/lookup/licenses
   * @sample lookup.licenses.json
   */
  async licenses(): Promise<LookupLicensesResponse> {
    return this.client.get<LookupLicensesResponse>("https://members-ng.iracing.com/data/lookup/licenses", { schema: LookupLicensesSchema });
  }

}