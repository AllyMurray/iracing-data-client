import { z } from "zod-mini";

// ---- Response Types ----

// ---- Parameter Schemas ----

const SeriesAssetsParamsSchema = z.object({
});

const SeriesGetParamsSchema = z.object({
});

const SeriesPastSeasonsParamsSchema = z.object({
  series_id: z.number(),
});

const SeriesSeasonsParamsSchema = z.object({
  include_series: z.boolean().optional(),
  season_year: z.number().optional(), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned.
  season_quarter: z.number().optional(), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned.
});

const SeriesSeasonListParamsSchema = z.object({
  include_series: z.boolean().optional(),
  season_year: z.number().optional(),
  season_quarter: z.number().optional(),
});

const SeriesSeasonScheduleParamsSchema = z.object({
  season_id: z.number(),
});

const SeriesStatsSeriesParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type SeriesAssetsParams = z.infer<typeof SeriesAssetsParamsSchema>;
export type SeriesGetParams = z.infer<typeof SeriesGetParamsSchema>;
export type SeriesPastSeasonsParams = z.infer<typeof SeriesPastSeasonsParamsSchema>;
export type SeriesSeasonsParams = z.infer<typeof SeriesSeasonsParamsSchema>;
export type SeriesSeasonListParams = z.infer<typeof SeriesSeasonListParamsSchema>;
export type SeriesSeasonScheduleParams = z.infer<typeof SeriesSeasonScheduleParamsSchema>;
export type SeriesStatsSeriesParams = z.infer<typeof SeriesStatsSeriesParamsSchema>;

// ---- Exported Schemas ----

export {
  SeriesAssetsParamsSchema,
  SeriesGetParamsSchema,
  SeriesPastSeasonsParamsSchema,
  SeriesSeasonsParamsSchema,
  SeriesSeasonListParamsSchema,
  SeriesSeasonScheduleParamsSchema,
  SeriesStatsSeriesParamsSchema,
};