import type { IRacingClient } from "../client";
import type { SeasonListParams, SeasonRaceGuideParams, SeasonSpectatorSubsessionidsParams, SeasonSpectatorSubsessionidsDetailParams, SeasonListResponse, SeasonRaceGuideResponse, SeasonSpectatorSubsessionidsResponse, SeasonSpectatorSubsessionidsDetailResponse } from "./types";
import { SeasonList, SeasonRaceGuide, SeasonSpectatorSubsessionids, SeasonSpectatorSubsessionidsDetail } from "./types";

export class SeasonService {
  constructor(private client: IRacingClient) {}

  /**
   * list
   * @see https://members-ng.iracing.com/data/season/list
   * @sample season.list.json
   */
  async list(params: SeasonListParams): Promise<SeasonListResponse> {
    return this.client.get<SeasonListResponse>("https://members-ng.iracing.com/data/season/list", { params, schema: SeasonList });
  }

  /**
   * race_guide
   * @see https://members-ng.iracing.com/data/season/race_guide
   * @sample season.race_guide.json
   */
  async raceGuide(params: SeasonRaceGuideParams): Promise<SeasonRaceGuideResponse> {
    return this.client.get<SeasonRaceGuideResponse>("https://members-ng.iracing.com/data/season/race_guide", { params, schema: SeasonRaceGuide });
  }

  /**
   * spectator_subsessionids
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids
   * @sample season.spectator_subsessionids.json
   */
  async spectatorSubsessionids(params: SeasonSpectatorSubsessionidsParams): Promise<SeasonSpectatorSubsessionidsResponse> {
    return this.client.get<SeasonSpectatorSubsessionidsResponse>("https://members-ng.iracing.com/data/season/spectator_subsessionids", { params, schema: SeasonSpectatorSubsessionids });
  }

  /**
   * spectator_subsessionids_detail
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids_detail
   * @sample season.spectator_subsessionids_detail.json
   */
  async spectatorSubsessionidsDetail(params: SeasonSpectatorSubsessionidsDetailParams): Promise<SeasonSpectatorSubsessionidsDetailResponse> {
    return this.client.get<SeasonSpectatorSubsessionidsDetailResponse>("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail", { params, schema: SeasonSpectatorSubsessionidsDetail });
  }

}