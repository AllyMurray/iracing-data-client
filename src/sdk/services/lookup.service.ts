import type { IRacingClient } from "../client";
import type { LookupCountriesParams, LookupDriversParams, LookupFlairsParams, LookupGetParams, LookupLicensesParams } from "./lookup.types";

export class LookupService {
  constructor(private client: IRacingClient) {}

  /**
   * countries
   * @see https://members-ng.iracing.com/data/lookup/countries
   */
  async countries(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/lookup/countries");
  }

  /**
   * drivers
   * @see https://members-ng.iracing.com/data/lookup/drivers
   */
  async drivers(params: LookupDriversParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/lookup/drivers", params);
  }

  /**
   * flairs
   * @see https://members-ng.iracing.com/data/lookup/flairs
   */
  async flairs(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/lookup/flairs");
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/lookup/get
   */
  async get(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/lookup/get");
  }

  /**
   * licenses
   * @see https://members-ng.iracing.com/data/lookup/licenses
   */
  async licenses(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/lookup/licenses");
  }

}