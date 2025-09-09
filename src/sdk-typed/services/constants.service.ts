import type { IRacingClient } from "../client";
import type { ConstantsCategoriesParams, ConstantsDivisionsParams, ConstantsEventTypesParams, ConstantsCategoriesResponse, ConstantsDivisionsResponse, ConstantsEventTypesResponse } from "./constants.types";

export class ConstantsService {
  constructor(private client: IRacingClient) {}

  /**
   * categories
   * @see https://members-ng.iracing.com/data/constants/categories
   * @sample constants.categories.json
   */
  async categories(): Promise<ConstantsCategoriesResponse> {
    return this.client.get<ConstantsCategoriesResponse>("https://members-ng.iracing.com/data/constants/categories");
  }

  /**
   * divisions
   * @see https://members-ng.iracing.com/data/constants/divisions
   * @sample constants.divisions.json
   */
  async divisions(): Promise<ConstantsDivisionsResponse> {
    return this.client.get<ConstantsDivisionsResponse>("https://members-ng.iracing.com/data/constants/divisions");
  }

  /**
   * event_types
   * @see https://members-ng.iracing.com/data/constants/event_types
   * @sample constants.event_types.json
   */
  async event_types(): Promise<ConstantsEventTypesResponse> {
    return this.client.get<ConstantsEventTypesResponse>("https://members-ng.iracing.com/data/constants/event_types");
  }

}