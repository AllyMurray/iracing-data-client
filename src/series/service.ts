import type { IRacingClient } from "../client";
import type { SeriesPastSeasonsParams, SeriesSeasonsParams, SeriesSeasonListParams, SeriesSeasonScheduleParams, SeriesAssetsResponse, SeriesGetResponse, SeriesPastSeasonsResponse, SeriesSeasonsResponse, SeriesSeasonListResponse, SeriesStatsSeriesResponse } from "./types";
import { SeriesAssets, SeriesGet, SeriesPastSeasons, SeriesSeasons, SeriesSeasonList, SeriesStatsSeries } from "./types";

export class SeriesService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/series/assets
   * @sample series.assets.json
   */
  async assets(): Promise<SeriesAssetsResponse> {
    return this.client.get<SeriesAssetsResponse>("https://members-ng.iracing.com/data/series/assets", { schema: SeriesAssets });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/series/get
   * @sample series.get.json
   */
  async get(): Promise<SeriesGetResponse> {
    return this.client.get<SeriesGetResponse>("https://members-ng.iracing.com/data/series/get", { schema: SeriesGet });
  }

  /**
   * past_seasons
   * @see https://members-ng.iracing.com/data/series/past_seasons
   * @sample series.past_seasons.json
   */
  async pastSeasons(params: SeriesPastSeasonsParams): Promise<SeriesPastSeasonsResponse> {
    return this.client.get<SeriesPastSeasonsResponse>("https://members-ng.iracing.com/data/series/past_seasons", { params, schema: SeriesPastSeasons });
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/series/seasons
   * @sample series.seasons.json
   */
  async seasons(params: SeriesSeasonsParams): Promise<SeriesSeasonsResponse> {
    return this.client.get<SeriesSeasonsResponse>("https://members-ng.iracing.com/data/series/seasons", { params, schema: SeriesSeasons });
  }

  /**
   * season_list
   * @see https://members-ng.iracing.com/data/series/season_list
   * @sample series.season_list.json
   */
  async seasonList(params: SeriesSeasonListParams): Promise<SeriesSeasonListResponse> {
    return this.client.get<SeriesSeasonListResponse>("https://members-ng.iracing.com/data/series/season_list", { params, schema: SeriesSeasonList });
  }

  /**
   * season_schedule
   * @see https://members-ng.iracing.com/data/series/season_schedule
   */
  async seasonSchedule(params: SeriesSeasonScheduleParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/series/season_schedule", { params });
  }

  /**
   * stats_series
   * @see https://members-ng.iracing.com/data/series/stats_series
   * @sample series.stats_series.json
   */
  async statsSeries(): Promise<SeriesStatsSeriesResponse> {
    return this.client.get<SeriesStatsSeriesResponse>("https://members-ng.iracing.com/data/series/stats_series", { schema: SeriesStatsSeries });
  }

}