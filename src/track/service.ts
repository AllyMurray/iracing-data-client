import type { IRacingClient } from "../client";
import type { TrackAssetsParams, TrackGetParams, TrackAssetsResponse, TrackGetResponse } from "./types";
import { TrackAssetsSchema, TrackGetSchema } from "./types";

export class TrackService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/track/assets
   * @sample track.assets.json
   */
  async assets(): Promise<TrackAssetsResponse> {
    return this.client.get<TrackAssetsResponse>("https://members-ng.iracing.com/data/track/assets", { schema: TrackAssetsSchema });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/track/get
   * @sample track.get.json
   */
  async get(): Promise<TrackGetResponse> {
    return this.client.get<TrackGetResponse>("https://members-ng.iracing.com/data/track/get", { schema: TrackGetSchema });
  }

}