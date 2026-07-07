import type { IRacingClient } from "../client";
import type { SeasonListParams, SeasonRaceGuideParams, SeasonSpectatorSubsessionidsParams, SeasonSpectatorSubsessionidsDetailParams, SeasonListResponse, SeasonRaceGuideResponse, SeasonSpectatorSubsessionidsResponse, SeasonSpectatorSubsessionidsDetailResponse } from "./types";
import * as z from "zod/mini";
import { SeasonList, SeasonRaceGuide, SeasonSpectatorSubsessionids, SeasonSpectatorSubsessionidsDetail } from "./types";

const listParams = z.object({
  seasonYear: z.number(), // maps to: season_year
  seasonQuarter: z.number(), // maps to: season_quarter
});

const raceGuideParams = z.object({
  from: z.optional(z.string()), // ISO-8601 offset format. Defaults to the current time. Include sessions with start times up to 3 hours after this time. Times in the past will be rewritten to the current time.
  includeEndAfterFrom: z.optional(z.boolean()), // Include sessions which start before 'from' but end after. // maps to: include_end_after_from
});

const spectatorSubsessionidsParams = z.object({
  eventTypes: z.optional(z.array(z.number())), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
});

const spectatorSubsessionidsDetailParams = z.object({
  eventTypes: z.optional(z.array(z.number())), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
  seasonIds: z.optional(z.array(z.number())), // Seasons to include in the search. Defaults to all. ?season_ids=513,937 // maps to: season_ids
});

export class SeasonService {
  constructor(private client: IRacingClient) {}

  /**
   * list
   * @see https://members-ng.iracing.com/data/season/list
   * @sample season.list.json
   */
  async list(params: SeasonListParams): Promise<SeasonListResponse> {
    return this.client.get<SeasonListResponse>("https://members-ng.iracing.com/data/season/list", { params, paramsValidator: listParams, schema: SeasonList });
  }

  /**
   * race_guide
   * @see https://members-ng.iracing.com/data/season/race_guide
   * @sample season.race_guide.json
   */
  async raceGuide(params?: SeasonRaceGuideParams): Promise<SeasonRaceGuideResponse> {
    return this.client.get<SeasonRaceGuideResponse>("https://members-ng.iracing.com/data/season/race_guide", { params, paramsValidator: raceGuideParams, schema: SeasonRaceGuide });
  }

  /**
   * spectator_subsessionids
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids
   * @sample season.spectator_subsessionids.json
   */
  async spectatorSubsessionids(params?: SeasonSpectatorSubsessionidsParams): Promise<SeasonSpectatorSubsessionidsResponse> {
    return this.client.get<SeasonSpectatorSubsessionidsResponse>("https://members-ng.iracing.com/data/season/spectator_subsessionids", { params, paramsValidator: spectatorSubsessionidsParams, schema: SeasonSpectatorSubsessionids });
  }

  /**
   * spectator_subsessionids_detail
   * @see https://members-ng.iracing.com/data/season/spectator_subsessionids_detail
   * @sample season.spectator_subsessionids_detail.json
   */
  async spectatorSubsessionidsDetail(params?: SeasonSpectatorSubsessionidsDetailParams): Promise<SeasonSpectatorSubsessionidsDetailResponse> {
    return this.client.get<SeasonSpectatorSubsessionidsDetailResponse>("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail", { params, paramsValidator: spectatorSubsessionidsDetailParams, schema: SeasonSpectatorSubsessionidsDetail });
  }

}