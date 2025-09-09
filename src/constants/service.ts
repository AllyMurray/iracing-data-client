import type { IRacingClient } from "../client";
import type { ConstantsCategoriesResponse, ConstantsDivisionsResponse, ConstantsEventTypesResponse } from "./types";
import { ConstantsCategories, ConstantsDivisions, ConstantsEventTypes } from "./types";

export class ConstantsService {
  constructor(private client: IRacingClient) {}

  /**
   * categories
   * @see https://members-ng.iracing.com/data/constants/categories
   * @sample constants.categories.json
   */
  async categories(): Promise<ConstantsCategoriesResponse> {
    return this.client.get<ConstantsCategoriesResponse>("https://members-ng.iracing.com/data/constants/categories", { schema: ConstantsCategories });
  }

  /**
   * divisions
   * @see https://members-ng.iracing.com/data/constants/divisions
   * @sample constants.divisions.json
   */
  async divisions(): Promise<ConstantsDivisionsResponse> {
    return this.client.get<ConstantsDivisionsResponse>("https://members-ng.iracing.com/data/constants/divisions", { schema: ConstantsDivisions });
  }

  /**
   * event_types
   * @see https://members-ng.iracing.com/data/constants/event_types
   * @sample constants.event_types.json
   */
  async eventTypes(): Promise<ConstantsEventTypesResponse> {
    return this.client.get<ConstantsEventTypesResponse>("https://members-ng.iracing.com/data/constants/event_types", { schema: ConstantsEventTypes });
  }

}