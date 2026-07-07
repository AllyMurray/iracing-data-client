import type { IRacingClient } from "../client";
import type { ResultsGetParams, ResultsEventLogParams, ResultsLapChartDataParams, ResultsLapDataParams, ResultsSearchHostedParams, ResultsSearchSeriesParams, ResultsSeasonResultsParams, ResultsGetResponse, ResultsEventLogResponse, ResultsLapChartDataResponse, ResultsLapDataResponse, ResultsSearchHostedResponse, ResultsSearchSeriesResponse, ResultsSeasonResultsResponse } from "./types";
import * as z from "zod/mini";
import { ResultsGet, ResultsEventLog, ResultsLapChartData, ResultsLapData, ResultsSearchHosted, ResultsSearchSeries, ResultsSeasonResults } from "./types";

const getParams = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  includeLicenses: z.optional(z.boolean()), // maps to: include_licenses
});

const eventLogParams = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
});

const lapChartDataParams = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
});

const lapDataParams = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
  custId: z.optional(z.number()), // Required if the subsession was a single-driver event. Optional for team events. If omitted for a team event then the laps driven by all the team's drivers will be included. // maps to: cust_id
  teamId: z.optional(z.number()), // Required if the subsession was a team event. // maps to: team_id
});

const searchHostedParams = z.object({
  startRangeBegin: z.optional(z.string()), // Session start times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". // maps to: start_range_begin
  startRangeEnd: z.optional(z.string()), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if start_range_begin is less than 90 days in the past. // maps to: start_range_end
  finishRangeBegin: z.optional(z.string()), // Session finish times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". // maps to: finish_range_begin
  finishRangeEnd: z.optional(z.string()), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if finish_range_begin is less than 90 days in the past. // maps to: finish_range_end
  custId: z.optional(z.number()), // The participant's customer ID. Ignored if team_id is supplied. // maps to: cust_id
  teamId: z.optional(z.number()), // The team ID to search for. Takes priority over cust_id if both are supplied. // maps to: team_id
  hostCustId: z.optional(z.number()), // The host's customer ID. // maps to: host_cust_id
  sessionName: z.optional(z.string()), // Part or all of the session's name. // maps to: session_name
  leagueId: z.optional(z.number()), // Include only results for the league with this ID. // maps to: league_id
  leagueSeasonId: z.optional(z.number()), // Include only results for the league season with this ID. // maps to: league_season_id
  carId: z.optional(z.number()), // One of the cars used by the session. // maps to: car_id
  trackId: z.optional(z.number()), // The ID of the track used by the session. // maps to: track_id
  categoryIds: z.optional(z.array(z.number())), // Track categories to include in the search.  Defaults to all. ?category_ids=1,2,3,4 // maps to: category_ids
});

const searchSeriesParams = z.object({
  seasonYear: z.optional(z.number()), // Required when using season_quarter. // maps to: season_year
  seasonQuarter: z.optional(z.number()), // Required when using season_year. // maps to: season_quarter
  startRangeBegin: z.optional(z.string()), // Session start times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". // maps to: start_range_begin
  startRangeEnd: z.optional(z.string()), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if start_range_begin is less than 90 days in the past. // maps to: start_range_end
  finishRangeBegin: z.optional(z.string()), // Session finish times. ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". // maps to: finish_range_begin
  finishRangeEnd: z.optional(z.string()), // ISO-8601 UTC time zero offset: "2022-04-01T15:45Z". Exclusive. May be omitted if finish_range_begin is less than 90 days in the past. // maps to: finish_range_end
  custId: z.optional(z.number()), // Include only sessions in which this customer participated. Ignored if team_id is supplied. // maps to: cust_id
  teamId: z.optional(z.number()), // Include only sessions in which this team participated. Takes priority over cust_id if both are supplied. // maps to: team_id
  seriesId: z.optional(z.number()), // Include only sessions for series with this ID. // maps to: series_id
  raceWeekNum: z.optional(z.number()), // Include only sessions with this race week number. // maps to: race_week_num
  officialOnly: z.optional(z.boolean()), // If true, include only sessions earning championship points. Defaults to all. // maps to: official_only
  eventTypes: z.optional(z.array(z.number())), // Types of events to include in the search. Defaults to all. ?event_types=2,3,4,5 // maps to: event_types
  categoryIds: z.optional(z.array(z.number())), // License categories to include in the search.  Defaults to all. ?category_ids=1,2,3,4 // maps to: category_ids
});

const seasonResultsParams = z.object({
  seasonId: z.number(), // maps to: season_id
  eventType: z.optional(z.number()), // Retrict to one event type: 2 - Practice; 3 - Qualify; 4 - Time Trial; 5 - Race // maps to: event_type
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

export class ResultsService {
  constructor(private client: IRacingClient) {}

  /**
   * get
   * @see https://members-ng.iracing.com/data/results/get
   * @sample results.get.json
   */
  async get(params: ResultsGetParams): Promise<ResultsGetResponse> {
    return this.client.get<ResultsGetResponse>("https://members-ng.iracing.com/data/results/get", { params, paramsValidator: getParams, schema: ResultsGet });
  }

  /**
   * event_log
   * @see https://members-ng.iracing.com/data/results/event_log
   * @sample results.event_log.json
   */
  async eventLog(params: ResultsEventLogParams): Promise<ResultsEventLogResponse> {
    return this.client.get<ResultsEventLogResponse>("https://members-ng.iracing.com/data/results/event_log", { params, paramsValidator: eventLogParams, schema: ResultsEventLog });
  }

  /**
   * lap_chart_data
   * @see https://members-ng.iracing.com/data/results/lap_chart_data
   * @sample results.lap_chart_data.json
   */
  async lapChartData(params: ResultsLapChartDataParams): Promise<ResultsLapChartDataResponse> {
    return this.client.get<ResultsLapChartDataResponse>("https://members-ng.iracing.com/data/results/lap_chart_data", { params, paramsValidator: lapChartDataParams, schema: ResultsLapChartData });
  }

  /**
   * lap_data
   * @see https://members-ng.iracing.com/data/results/lap_data
   * @sample results.lap_data_var3.json
   */
  async lapData(params: ResultsLapDataParams): Promise<ResultsLapDataResponse> {
    return this.client.get<ResultsLapDataResponse>("https://members-ng.iracing.com/data/results/lap_data", { params, paramsValidator: lapDataParams, schema: ResultsLapData });
  }

  /**
   * search_hosted
   * @see https://members-ng.iracing.com/data/results/search_hosted
   * @sample results.search_hosted.json
   */
  async searchHosted(params?: ResultsSearchHostedParams): Promise<ResultsSearchHostedResponse> {
    return this.client.get<ResultsSearchHostedResponse>("https://members-ng.iracing.com/data/results/search_hosted", { params, paramsValidator: searchHostedParams, schema: ResultsSearchHosted });
  }

  /**
   * search_series
   * @see https://members-ng.iracing.com/data/results/search_series
   * @sample results.search_series.json
   */
  async searchSeries(params?: ResultsSearchSeriesParams): Promise<ResultsSearchSeriesResponse> {
    return this.client.get<ResultsSearchSeriesResponse>("https://members-ng.iracing.com/data/results/search_series", { params, paramsValidator: searchSeriesParams, schema: ResultsSearchSeries });
  }

  /**
   * season_results
   * @see https://members-ng.iracing.com/data/results/season_results
   * @sample results.season_results.json
   */
  async seasonResults(params: ResultsSeasonResultsParams): Promise<ResultsSeasonResultsResponse> {
    return this.client.get<ResultsSeasonResultsResponse>("https://members-ng.iracing.com/data/results/season_results", { params, paramsValidator: seasonResultsParams, schema: ResultsSeasonResults });
  }

}