import type { IRacingClient } from "../client";
import type { ResultsGetParams, ResultsEventLogParams, ResultsLapChartDataParams, ResultsLapDataParams, ResultsSearchHostedParams, ResultsSearchSeriesParams, ResultsSeasonResultsParams } from "./types";

export class ResultsService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/results/get
   */
  async get(params: ResultsGetParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/get", params);
  }

  /**
   * event_log
   * @see https://members-ng.iracing.com/data/results/event_log
   */
  async eventLog(params: ResultsEventLogParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/event_log", params);
  }

  /**
   * lap_chart_data
   * @see https://members-ng.iracing.com/data/results/lap_chart_data
   */
  async lapChartData(params: ResultsLapChartDataParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/lap_chart_data", params);
  }

  /**
   * lap_data
   * @see https://members-ng.iracing.com/data/results/lap_data
   */
  async lapData(params: ResultsLapDataParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/lap_data", params);
  }

  /**
   * search_hosted
   * @see https://members-ng.iracing.com/data/results/search_hosted
   */
  async searchHosted(params: ResultsSearchHostedParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/search_hosted", params);
  }

  /**
   * search_series
   * @see https://members-ng.iracing.com/data/results/search_series
   */
  async searchSeries(params: ResultsSearchSeriesParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/search_series", params);
  }

  /**
   * season_results
   * @see https://members-ng.iracing.com/data/results/season_results
   */
  async seasonResults(params: ResultsSeasonResultsParams): Promise<unknown> {
    return this.client.get<unknown>("https://members-ng.iracing.com/data/results/season_results", params);
  }

}