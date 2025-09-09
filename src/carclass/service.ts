import type { IRacingClient } from "../client";
import type { CarclassGetResponse } from "./types";
import { CarclassGetSchema } from "./types";

export class CarclassService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/carclass/get
   * @sample carclass.get.json
   */
  async get(): Promise<CarclassGetResponse> {
    return this.client.get<CarclassGetResponse>("https://members-ng.iracing.com/data/carclass/get", { schema: CarclassGetSchema });
  }

}