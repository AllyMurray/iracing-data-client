import type { IRacingClient } from "../client";
import type { DriverStatsByCategoryOvalResponse, DriverStatsByCategorySportsCarResponse, DriverStatsByCategoryFormulaCarResponse, DriverStatsByCategoryRoadResponse, DriverStatsByCategoryDirtOvalResponse, DriverStatsByCategoryDirtRoadResponse } from "./types";
import { DriverStatsByCategoryOval, DriverStatsByCategorySportsCar, DriverStatsByCategoryFormulaCar, DriverStatsByCategoryRoad, DriverStatsByCategoryDirtOval, DriverStatsByCategoryDirtRoad } from "./types";

export class DriverStatsByCategoryService {
  constructor(private client: IRacingClient) {}

  /**
   * oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/oval
   * @sample driver_stats_by_category.oval.json
   */
  async oval(): Promise<DriverStatsByCategoryOvalResponse> {
    return this.client.get<DriverStatsByCategoryOvalResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/oval", { schema: DriverStatsByCategoryOval });
  }

  /**
   * sports_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/sports_car
   * @sample driver_stats_by_category.sports_car.json
   */
  async sportsCar(): Promise<DriverStatsByCategorySportsCarResponse> {
    return this.client.get<DriverStatsByCategorySportsCarResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/sports_car", { schema: DriverStatsByCategorySportsCar });
  }

  /**
   * formula_car
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/formula_car
   * @sample driver_stats_by_category.formula_car.json
   */
  async formulaCar(): Promise<DriverStatsByCategoryFormulaCarResponse> {
    return this.client.get<DriverStatsByCategoryFormulaCarResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/formula_car", { schema: DriverStatsByCategoryFormulaCar });
  }

  /**
   * road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/road
   * @sample driver_stats_by_category.road.json
   */
  async road(): Promise<DriverStatsByCategoryRoadResponse> {
    return this.client.get<DriverStatsByCategoryRoadResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/road", { schema: DriverStatsByCategoryRoad });
  }

  /**
   * dirt_oval
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval
   * @sample driver_stats_by_category.dirt_oval.json
   */
  async dirtOval(): Promise<DriverStatsByCategoryDirtOvalResponse> {
    return this.client.get<DriverStatsByCategoryDirtOvalResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval", { schema: DriverStatsByCategoryDirtOval });
  }

  /**
   * dirt_road
   * @see https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road
   * @sample driver_stats_by_category.dirt_road.json
   */
  async dirtRoad(): Promise<DriverStatsByCategoryDirtRoadResponse> {
    return this.client.get<DriverStatsByCategoryDirtRoadResponse>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road", { schema: DriverStatsByCategoryDirtRoad });
  }

}