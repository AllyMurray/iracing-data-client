import type { IRacingClient } from "../client";
import type { ConstantsCategoriesParams, ConstantsDivisionsParams, ConstantsEventTypesParams } from "./constants.types";

export class ConstantsService {
  constructor(private client: IRacingClient) {}

  /**
   * categories
   * @see https://members-ng.iracing.com/data/constants/categories
   */
  async categories(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/constants/categories");
  }

  /**
   * divisions
   * @see https://members-ng.iracing.com/data/constants/divisions
   */
  async divisions(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/constants/divisions");
  }

  /**
   * event_types
   * @see https://members-ng.iracing.com/data/constants/event_types
   */
  async event_types(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/constants/event_types");
  }

}