import type { IRacingClient } from "../client";
import type { DriverStatsByCategoryOvalParams, DriverStatsByCategorySportsCarParams, DriverStatsByCategoryFormulaCarParams, DriverStatsByCategoryRoadParams, DriverStatsByCategoryDirtOvalParams, DriverStatsByCategoryDirtRoadParams } from "./driver-stats-by-category.types";

export class DriverStatsByCategoryService {
  constructor(private client: IRacingClient) {}

  /**
   * oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/oval
   */
  async oval(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/oval");
  }

  /**
   * sports_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/sports_car
   */
  async sports_car(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/sports_car");
  }

  /**
   * formula_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/formula_car
   */
  async formula_car(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/formula_car");
  }

  /**
   * road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/road
   */
  async road(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/road");
  }

  /**
   * dirt_oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval
   */
  async dirt_oval(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval");
  }

  /**
   * dirt_road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road
   */
  async dirt_road(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road");
  }

}