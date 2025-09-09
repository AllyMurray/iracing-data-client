import type { IRacingClient } from "../client";
import type { ResultsGetParams, ResultsEventLogParams, ResultsLapChartDataParams, ResultsLapDataParams, ResultsSearchHostedParams, ResultsSearchSeriesParams, ResultsSeasonResultsParams } from "./results.types";

export class ResultsService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/results/get
   */
  async get(params: ResultsGetParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/get", params);
  }

  /**
   * event_log
   * @see https://members-ng.iracing.com/data/results/event_log
   */
  async event_log(params: ResultsEventLogParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/event_log", params);
  }

  /**
   * lap_chart_data
   * @see https://members-ng.iracing.com/data/results/lap_chart_data
   */
  async lap_chart_data(params: ResultsLapChartDataParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/lap_chart_data", params);
  }

  /**
   * lap_data
   * @see https://members-ng.iracing.com/data/results/lap_data
   */
  async lap_data(params: ResultsLapDataParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/lap_data", params);
  }

  /**
   * search_hosted
   * @see https://members-ng.iracing.com/data/results/search_hosted
   */
  async search_hosted(params: ResultsSearchHostedParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/search_hosted", params);
  }

  /**
   * search_series
   * @see https://members-ng.iracing.com/data/results/search_series
   */
  async search_series(params: ResultsSearchSeriesParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/search_series", params);
  }

  /**
   * season_results
   * @see https://members-ng.iracing.com/data/results/season_results
   */
  async season_results(params: ResultsSeasonResultsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/results/season_results", params);
  }

}