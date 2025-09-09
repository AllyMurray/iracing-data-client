import type { IRacingClient } from "../client";
import type { TrackAssetsParams, TrackGetParams } from "./track.types";

export class TrackService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/track/assets
   */
  async assets(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/track/assets");
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/track/get
   */
  async get(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/track/get");
  }

}