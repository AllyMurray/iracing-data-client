import type { IRacingClient } from "../client";
import type { CarAssetsResponse, CarGetResponse } from "./types";
import { CarAssets, CarGet } from "./types";

export class CarService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/car/assets
   * @sample car.assets.json
   */
  async assets(): Promise<CarAssetsResponse> {
    return this.client.get<CarAssetsResponse>("https://members-ng.iracing.com/data/car/assets", { schema: CarAssets });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/car/get
   * @sample car.get.json
   */
  async get(): Promise<CarGetResponse> {
    return this.client.get<CarGetResponse>("https://members-ng.iracing.com/data/car/get", { schema: CarGet });
  }

}