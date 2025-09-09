import type { IRacingClient } from "../client";
import type { SeriesAssetsParams, SeriesGetParams, SeriesPastSeasonsParams, SeriesSeasonsParams, SeriesSeasonListParams, SeriesSeasonScheduleParams, SeriesStatsSeriesParams, SeriesAssetsResponse, SeriesGetResponse, SeriesSeasonsResponse, SeriesSeasonListResponse, SeriesStatsSeriesResponse } from "./types";

export class SeriesService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/series/assets
   * @sample series.assets.json
   */
  async assets(): Promise<SeriesAssetsResponse> {
    return this.client.get<SeriesAssetsResponse>("https://members-ng.iracing.com/data/series/assets");
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/series/get
   * @sample series.get.json
   */
  async get(): Promise<SeriesGetResponse> {
    return this.client.get<SeriesGetResponse>("https://members-ng.iracing.com/data/series/get");
  }

  /**
   * past_seasons
   * @see https://members-ng.iracing.com/data/series/past_seasons
   */
  async pastSeasons(params: SeriesPastSeasonsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/series/past_seasons", params);
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/series/seasons
   * @sample series.seasons.json
   */
  async seasons(params: SeriesSeasonsParams): Promise<SeriesSeasonsResponse> {
    return this.client.get<SeriesSeasonsResponse>("https://members-ng.iracing.com/data/series/seasons", params);
  }

  /**
   * season_list
   * @see https://members-ng.iracing.com/data/series/season_list
   * @sample series.season_list.json
   */
  async seasonList(params: SeriesSeasonListParams): Promise<SeriesSeasonListResponse> {
    return this.client.get<SeriesSeasonListResponse>("https://members-ng.iracing.com/data/series/season_list", params);
  }

  /**
   * season_schedule
   * @see https://members-ng.iracing.com/data/series/season_schedule
   */
  async seasonSchedule(params: SeriesSeasonScheduleParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/series/season_schedule", params);
  }

  /**
   * stats_series
   * @see https://members-ng.iracing.com/data/series/stats_series
   * @sample series.stats_series.json
   */
  async statsSeries(): Promise<SeriesStatsSeriesResponse> {
    return this.client.get<SeriesStatsSeriesResponse>("https://members-ng.iracing.com/data/series/stats_series");
  }

}