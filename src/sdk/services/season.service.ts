import type { IRacingClient } from "../client";
import type { SeasonListParams, SeasonRaceGuideParams, SeasonSpectatorSubsessionidsParams, SeasonSpectatorSubsessionidsDetailParams } from "./season.types";

export class SeasonService {
  constructor(private client: IRacingClient) {}

  /**
   * list
   * @see https://members-ng.iracing.com/data/season/list
   */
  async list(params: SeasonListParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/season/list", params);
  }

  /**
   * race_guide
   * @see https://members-ng.iracing.com/data/season/race_guide
   */
  async race_guide(params: SeasonRaceGuideParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/season/race_guide", params);
  }

  /**
   * spectator_subsessionids
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids
   */
  async spectator_subsessionids(params: SeasonSpectatorSubsessionidsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/season/spectator_subsessionids", params);
  }

  /**
   * spectator_subsessionids_detail
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids_detail
   */
  async spectator_subsessionids_detail(params: SeasonSpectatorSubsessionidsDetailParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail", params);
  }

}