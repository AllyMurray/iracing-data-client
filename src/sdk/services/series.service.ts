import type { IRacingClient } from "../client";
import type { SeriesAssetsParams, SeriesGetParams, SeriesPastSeasonsParams, SeriesSeasonsParams, SeriesSeasonListParams, SeriesSeasonScheduleParams, SeriesStatsSeriesParams } from "./series.types";

export class SeriesService {
  constructor(private client: IRacingClient) {}

  /**
   * assets
   * @see https://members-ng.iracing.com/data/series/assets
   */
  async assets(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/assets");
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/series/get
   */
  async get(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/get");
  }

  /**
   * past_seasons
   * @see https://members-ng.iracing.com/data/series/past_seasons
   */
  async past_seasons(params: SeriesPastSeasonsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/past_seasons", params);
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/series/seasons
   */
  async seasons(params: SeriesSeasonsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/seasons", params);
  }

  /**
   * season_list
   * @see https://members-ng.iracing.com/data/series/season_list
   */
  async season_list(params: SeriesSeasonListParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/season_list", params);
  }

  /**
   * season_schedule
   * @see https://members-ng.iracing.com/data/series/season_schedule
   */
  async season_schedule(params: SeriesSeasonScheduleParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/season_schedule", params);
  }

  /**
   * stats_series
   * @see https://members-ng.iracing.com/data/series/stats_series
   */
  async stats_series(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/series/stats_series");
  }

}