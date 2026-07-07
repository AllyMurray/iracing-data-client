import type { IRacingClient } from "../client";
import type { SeriesPastSeasonsParams, SeriesSeasonsParams, SeriesSeasonListParams, SeriesSeasonScheduleParams, SeriesAssetsResponse, SeriesGetResponse, SeriesPastSeasonsResponse, SeriesSeasonsResponse, SeriesSeasonListResponse, SeriesSeasonScheduleResponse, SeriesStatsSeriesResponse } from "./types";
import * as z from "zod/mini";
import { SeriesAssets, SeriesGet, SeriesPastSeasons, SeriesSeasons, SeriesSeasonList, SeriesSeasonSchedule, SeriesStatsSeries } from "./types";

const pastSeasonsParams = z.object({
  seriesId: z.number(), // maps to: series_id
});

const seasonsParams = z.object({
  includeSeries: z.optional(z.boolean()), // maps to: include_series
  seasonYear: z.optional(z.number()), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned. // maps to: season_year
  seasonQuarter: z.optional(z.number()), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned. // maps to: season_quarter
});

const seasonListParams = z.object({
  includeSeries: z.optional(z.boolean()), // maps to: include_series
  seasonYear: z.optional(z.number()), // maps to: season_year
  seasonQuarter: z.optional(z.number()), // maps to: season_quarter
});

const seasonScheduleParams = z.object({
  seasonId: z.number(), // maps to: season_id
});

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
    return this.client.get<SeriesPastSeasonsResponse>("https://members-ng.iracing.com/data/series/past_seasons", { params, paramsValidator: pastSeasonsParams, schema: SeriesPastSeasons });
  }

  /**
   * seasons
   * @see https://members-ng.iracing.com/data/series/seasons
   * @sample series.seasons.json
   */
  async seasons(params?: SeriesSeasonsParams): Promise<SeriesSeasonsResponse> {
    return this.client.get<SeriesSeasonsResponse>("https://members-ng.iracing.com/data/series/seasons", { params, paramsValidator: seasonsParams, schema: SeriesSeasons });
  }

  /**
   * season_list
   * @see https://members-ng.iracing.com/data/series/season_list
   * @sample series.season_list.json
   */
  async seasonList(params?: SeriesSeasonListParams): Promise<SeriesSeasonListResponse> {
    return this.client.get<SeriesSeasonListResponse>("https://members-ng.iracing.com/data/series/season_list", { params, paramsValidator: seasonListParams, schema: SeriesSeasonList });
  }

  /**
   * season_schedule
   * @see https://members-ng.iracing.com/data/series/season_schedule
   * @sample series.season_schedule.json
   */
  async seasonSchedule(params: SeriesSeasonScheduleParams): Promise<SeriesSeasonScheduleResponse> {
    return this.client.get<SeriesSeasonScheduleResponse>("https://members-ng.iracing.com/data/series/season_schedule", { params, paramsValidator: seasonScheduleParams, schema: SeriesSeasonSchedule });
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