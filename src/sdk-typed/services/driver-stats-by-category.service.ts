import type { IRacingClient } from "../client";
import type { DriverStatsByCategoryOvalParams, DriverStatsByCategorySportsCarParams, DriverStatsByCategoryFormulaCarParams, DriverStatsByCategoryRoadParams, DriverStatsByCategoryDirtOvalParams, DriverStatsByCategoryDirtRoadParams, DriverStatsByCategoryOvalResponse, DriverStatsByCategorySportsCarResponse, DriverStatsByCategoryFormulaCarResponse, DriverStatsByCategoryRoadResponse, DriverStatsByCategoryDirtOvalResponse, DriverStatsByCategoryDirtRoadResponse } from "./driver-stats-by-category.types";

export class DriverStatsByCategoryService {
  constructor(private client: IRacingClient) {}

  /**
   * oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/oval
   * @sample driver_stats_by_category.oval.json
   */
  async oval(): Promise<DriverStatsByCategoryOvalResponse> {
    return this.client.get<DriverStatsByCategoryOvalResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/oval");
  }

  /**
   * sports_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/sports_car
   * @sample driver_stats_by_category.sports_car.json
   */
  async sports_car(): Promise<DriverStatsByCategorySportsCarResponse> {
    return this.client.get<DriverStatsByCategorySportsCarResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/sports_car");
  }

  /**
   * formula_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/formula_car
   * @sample driver_stats_by_category.formula_car.json
   */
  async formula_car(): Promise<DriverStatsByCategoryFormulaCarResponse> {
    return this.client.get<DriverStatsByCategoryFormulaCarResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/formula_car");
  }

  /**
   * road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/road
   * @sample driver_stats_by_category.road.json
   */
  async road(): Promise<DriverStatsByCategoryRoadResponse> {
    return this.client.get<DriverStatsByCategoryRoadResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/road");
  }

  /**
   * dirt_oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval
   * @sample driver_stats_by_category.dirt_oval.json
   */
  async dirt_oval(): Promise<DriverStatsByCategoryDirtOvalResponse> {
    return this.client.get<DriverStatsByCategoryDirtOvalResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval");
  }

  /**
   * dirt_road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road
   * @sample driver_stats_by_category.dirt_road.json
   */
  async dirt_road(): Promise<DriverStatsByCategoryDirtRoadResponse> {
    return this.client.get<DriverStatsByCategoryDirtRoadResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road");
  }

}