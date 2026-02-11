import type { IRacingClient } from "../client";
import type { ResultsGetParams, ResultsEventLogParams, ResultsLapChartDataParams, ResultsLapDataParams, ResultsSearchHostedParams, ResultsSearchSeriesParams, ResultsSeasonResultsParams, ResultsGetResponse, ResultsEventLogResponse, ResultsLapChartDataResponse, ResultsLapDataResponse, ResultsSearchHostedResponse, ResultsSearchSeriesResponse, ResultsSeasonResultsResponse } from "./types";
import { ResultsGet, ResultsEventLog, ResultsLapChartData, ResultsLapData, ResultsSearchHosted, ResultsSearchSeries, ResultsSeasonResults } from "./types";

export class ResultsService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/results/get
   * @sample results.get.json
   */
  async get(params: ResultsGetParams): Promise<ResultsGetResponse> {
    return this.client.get<ResultsGetResponse>("https://members-ng.iracing.com/data/results/get", { params, schema: ResultsGet });
  }

  /**
   * event_log
   * @see https://members-ng.iracing.com/data/results/event_log
   * @sample results.event_log.json
   */
  async eventLog(params: ResultsEventLogParams): Promise<ResultsEventLogResponse> {
    return this.client.get<ResultsEventLogResponse>("https://members-ng.iracing.com/data/results/event_log", { params, schema: ResultsEventLog });
  }

  /**
   * lap_chart_data
   * @see https://members-ng.iracing.com/data/results/lap_chart_data
   * @sample results.lap_chart_data.json
   */
  async lapChartData(params: ResultsLapChartDataParams): Promise<ResultsLapChartDataResponse> {
    return this.client.get<ResultsLapChartDataResponse>("https://members-ng.iracing.com/data/results/lap_chart_data", { params, schema: ResultsLapChartData });
  }

  /**
   * lap_data
   * @see https://members-ng.iracing.com/data/results/lap_data
   * @sample results.lap_data_var3.json
   */
  async lapData(params: ResultsLapDataParams): Promise<ResultsLapDataResponse> {
    return this.client.get<ResultsLapDataResponse>("https://members-ng.iracing.com/data/results/lap_data", { params, schema: ResultsLapData });
  }

  /**
   * search_hosted
   * @see https://members-ng.iracing.com/data/results/search_hosted
   * @sample results.search_hosted.json
   */
  async searchHosted(params: ResultsSearchHostedParams): Promise<ResultsSearchHostedResponse> {
    return this.client.get<ResultsSearchHostedResponse>("https://members-ng.iracing.com/data/results/search_hosted", { params, schema: ResultsSearchHosted });
  }

  /**
   * search_series
   * @see https://members-ng.iracing.com/data/results/search_series
   * @sample results.search_series.json
   */
  async searchSeries(params: ResultsSearchSeriesParams): Promise<ResultsSearchSeriesResponse> {
    return this.client.get<ResultsSearchSeriesResponse>("https://members-ng.iracing.com/data/results/search_series", { params, schema: ResultsSearchSeries });
  }

  /**
   * season_results
   * @see https://members-ng.iracing.com/data/results/season_results
   * @sample results.season_results.json
   */
  async seasonResults(params: ResultsSeasonResultsParams): Promise<ResultsSeasonResultsResponse> {
    return this.client.get<ResultsSeasonResultsResponse>("https://members-ng.iracing.com/data/results/season_results", { params, schema: ResultsSeasonResults });
  }

}