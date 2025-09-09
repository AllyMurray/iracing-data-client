import type { IRacingClient } from "../client";
import type { CarclassGetParams } from "./carclass.types";

export class CarclassService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/carclass/get
   */
  async get(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/carclass/get");
  }

}