import type { IRacingClient } from "../client";
import type { CarAssetsParams, CarGetParams } from "./car.types";

export class CarService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/car/assets
   */
  async assets(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/car/assets");
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/car/get
   */
  async get(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/car/get");
  }

}