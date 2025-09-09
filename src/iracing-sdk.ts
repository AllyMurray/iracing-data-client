/* AUTO-GENERATED — do not edit */

import { z } from "zod-mini";

/** Lightweight client with presigned-link following and caching */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface IRacingClientOptions {
  headers?: Record<string, string>; // e.g. Cookie for iRacing
  fetchFn?: FetchLike;              // uses global fetch by default
}

type ExpiringLink = { link: string; expires?: string };
type CacheEntry = { data: unknown; expiresAt: number };

export class IRacingClient {
  private fetchFn: FetchLike;
  private headers?: Record<string, string>;
  private expiringCache = new Map<string, CacheEntry>();

  constructor(opts: IRacingClientOptions = {}) {
    this.fetchFn = opts.fetchFn ?? (globalThis as any).fetch;
    if (!this.fetchFn) throw new Error("No fetch available. Pass fetchFn in IRacingClientOptions.");
    this.headers = opts.headers;
  }

  private toQuery(params: Record<string, any>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params || {})) {
      if (v == null) continue;
      if (Array.isArray(v)) usp.set(k, v.join(","));
      else if (typeof v === "boolean") usp.set(k, v ? "true" : "false");
      else usp.set(k, String(v));
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
  }

  private async get<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const q = this.toQuery(params || {});
    const res = await this.fetchFn(url + q, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json() as Promise<T>;
    return res.text() as unknown as T;
  }

  private isExpiring(x: any): x is ExpiringLink {
    return !!x && typeof x === "object" && typeof x.link === "string";
  }

  private expiresToMs(expires?: string) {
    if (!expires) return;
    const t = Date.parse(expires);
    return Number.isFinite(t) ? t : undefined;
  }

  /** Follows {link, expires} payloads (presigned S3) and caches until expiry. */
  async getDeep<T = unknown>(url: string, params?: Record<string, any>): Promise<T> {
    const first = await this.get<unknown>(url, params);
    if (!this.isExpiring(first)) return first as T;

    const { link, expires } = first;
    const now = Date.now();
    const cached = this.expiringCache.get(link);
    if (cached && cached.expiresAt > now + 1000) return cached.data as T;

    const pull = async (l: string, e?: string): Promise<T> => {
      const res = await this.fetchFn(l, { headers: this.headers });
      if (!res.ok) throw new Error(`Final hop failed ${res.status}`);
      const ct = res.headers.get("content-type") || "";
      const data = (ct.includes("application/json") ? await res.json() : await res.text()) as T;
      const expMs = this.expiresToMs(e) ?? now + 60_000;
      this.expiringCache.set(l, { data, expiresAt: expMs });
      return data;
    };

    try {
      return await pull(link, expires);
    } catch {
      // refresh first hop if expired
      const refreshed = await this.get<unknown>(url, params);
      if (this.isExpiring(refreshed)) return pull(refreshed.link, refreshed.expires);
      return refreshed as T;
    }
  }

  /** Resolve images from iRacing’s static host. */
  imageUrl(relative: string, base = "https://images-static.iracing.com/") {
    if (!relative) return relative;
    if (/^https?:\/\//i.test(relative)) return relative;
    return base.replace(/\/+$/, "") + "/" + relative.replace(/^\/+/, "");
  }
}

// ---- Parameter schemas (zod-mini) ----
export const CarAssetsParamsSchema = z.object({});
export type CarAssetsParams = z.infer<typeof CarAssetsParamsSchema>;

export const CarGetParamsSchema = z.object({});
export type CarGetParams = z.infer<typeof CarGetParamsSchema>;

export const CarclassGetParamsSchema = z.object({});
export type CarclassGetParams = z.infer<typeof CarclassGetParamsSchema>;

export const ConstantsCategoriesParamsSchema = z.object({});
export type ConstantsCategoriesParams = z.infer<typeof ConstantsCategoriesParamsSchema>;

export const ConstantsDivisionsParamsSchema = z.object({});
export type ConstantsDivisionsParams = z.infer<typeof ConstantsDivisionsParamsSchema>;

export const ConstantsEventTypesParamsSchema = z.object({});
export type ConstantsEventTypesParams = z.infer<typeof ConstantsEventTypesParamsSchema>;

export const DriverStatsByCategoryOvalParamsSchema = z.object({});
export type DriverStatsByCategoryOvalParams = z.infer<typeof DriverStatsByCategoryOvalParamsSchema>;

export const DriverStatsByCategorySportsCarParamsSchema = z.object({});
export type DriverStatsByCategorySportsCarParams = z.infer<typeof DriverStatsByCategorySportsCarParamsSchema>;

export const DriverStatsByCategoryFormulaCarParamsSchema = z.object({});
export type DriverStatsByCategoryFormulaCarParams = z.infer<typeof DriverStatsByCategoryFormulaCarParamsSchema>;

export const DriverStatsByCategoryRoadParamsSchema = z.object({});
export type DriverStatsByCategoryRoadParams = z.infer<typeof DriverStatsByCategoryRoadParamsSchema>;

export const DriverStatsByCategoryDirtOvalParamsSchema = z.object({});
export type DriverStatsByCategoryDirtOvalParams = z.infer<typeof DriverStatsByCategoryDirtOvalParamsSchema>;

export const DriverStatsByCategoryDirtRoadParamsSchema = z.object({});
export type DriverStatsByCategoryDirtRoadParams = z.infer<typeof DriverStatsByCategoryDirtRoadParamsSchema>;

export const HostedCombinedSessionsParamsSchema = z.object({
  "package_id": z.number().optional()
});
export type HostedCombinedSessionsParams = z.infer<typeof HostedCombinedSessionsParamsSchema>;

export const HostedSessionsParamsSchema = z.object({});
export type HostedSessionsParams = z.infer<typeof HostedSessionsParamsSchema>;

export const LeagueCustLeagueSessionsParamsSchema = z.object({
  "mine": z.boolean().optional(),
  "package_id": z.number().optional()
});
export type LeagueCustLeagueSessionsParams = z.infer<typeof LeagueCustLeagueSessionsParamsSchema>;

export const LeagueDirectoryParamsSchema = z.object({
  "search": z.string().optional(),
  "tag": z.string().optional(),
  "restrict_to_member": z.boolean().optional(),
  "restrict_to_recruiting": z.boolean().optional(),
  "restrict_to_friends": z.boolean().optional(),
  "restrict_to_watched": z.boolean().optional(),
  "minimum_roster_count": z.number().optional(),
  "maximum_roster_count": z.number().optional(),
  "lowerbound": z.number().optional(),
  "upperbound": z.number().optional(),
  "sort": z.string().optional(),
  "order": z.string().optional()
});
export type LeagueDirectoryParams = z.infer<typeof LeagueDirectoryParamsSchema>;

export const LeagueGetParamsSchema = z.object({
  "league_id": z.number(),
  "include_licenses": z.boolean().optional()
});
export type LeagueGetParams = z.infer<typeof LeagueGetParamsSchema>;

export const LeagueGetPointsSystemsParamsSchema = z.object({
  "league_id": z.number(),
  "season_id": z.number().optional()
});
export type LeagueGetPointsSystemsParams = z.infer<typeof LeagueGetPointsSystemsParamsSchema>;

export const LeagueMembershipParamsSchema = z.object({
  "cust_id": z.number().optional(),
  "include_league": z.boolean().optional()
});
export type LeagueMembershipParams = z.infer<typeof LeagueMembershipParamsSchema>;

export const LeagueRosterParamsSchema = z.object({
  "league_id": z.number(),
  "include_licenses": z.boolean().optional()
});
export type LeagueRosterParams = z.infer<typeof LeagueRosterParamsSchema>;

export const LeagueSeasonsParamsSchema = z.object({
  "league_id": z.number(),
  "retired": z.boolean().optional()
});
export type LeagueSeasonsParams = z.infer<typeof LeagueSeasonsParamsSchema>;

export const LeagueSeasonStandingsParamsSchema = z.object({
  "league_id": z.number(),
  "season_id": z.number(),
  "car_class_id": z.number().optional(),
  "car_id": z.number().optional()
});
export type LeagueSeasonStandingsParams = z.infer<typeof LeagueSeasonStandingsParamsSchema>;

export const LeagueSeasonSessionsParamsSchema = z.object({
  "league_id": z.number(),
  "season_id": z.number(),
  "results_only": z.boolean().optional()
});
export type LeagueSeasonSessionsParams = z.infer<typeof LeagueSeasonSessionsParamsSchema>;

export const LookupCountriesParamsSchema = z.object({});
export type LookupCountriesParams = z.infer<typeof LookupCountriesParamsSchema>;

export const LookupDriversParamsSchema = z.object({
  "search_term": z.string(),
  "league_id": z.number().optional()
});
export type LookupDriversParams = z.infer<typeof LookupDriversParamsSchema>;

export const LookupFlairsParamsSchema = z.object({});
export type LookupFlairsParams = z.infer<typeof LookupFlairsParamsSchema>;

export const LookupGetParamsSchema = z.object({});
export type LookupGetParams = z.infer<typeof LookupGetParamsSchema>;

export const LookupLicensesParamsSchema = z.object({});
export type LookupLicensesParams = z.infer<typeof LookupLicensesParamsSchema>;

export const MemberAwardsParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type MemberAwardsParams = z.infer<typeof MemberAwardsParamsSchema>;

export const MemberAwardInstancesParamsSchema = z.object({
  "cust_id": z.number().optional(),
  "award_id": z.number()
});
export type MemberAwardInstancesParams = z.infer<typeof MemberAwardInstancesParamsSchema>;

export const MemberChartDataParamsSchema = z.object({
  "cust_id": z.number().optional(),
  "category_id": z.number(),
  "chart_type": z.number()
});
export type MemberChartDataParams = z.infer<typeof MemberChartDataParamsSchema>;

export const MemberGetParamsSchema = z.object({
  "cust_ids": z.array(z.number()),
  "include_licenses": z.boolean().optional()
});
export type MemberGetParams = z.infer<typeof MemberGetParamsSchema>;

export const MemberInfoParamsSchema = z.object({});
export type MemberInfoParams = z.infer<typeof MemberInfoParamsSchema>;

export const MemberParticipationCreditsParamsSchema = z.object({});
export type MemberParticipationCreditsParams = z.infer<typeof MemberParticipationCreditsParamsSchema>;

export const MemberProfileParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type MemberProfileParams = z.infer<typeof MemberProfileParamsSchema>;

export const ResultsGetParamsSchema = z.object({
  "subsession_id": z.number(),
  "include_licenses": z.boolean().optional()
});
export type ResultsGetParams = z.infer<typeof ResultsGetParamsSchema>;

export const ResultsEventLogParamsSchema = z.object({
  "subsession_id": z.number(),
  "simsession_number": z.number()
});
export type ResultsEventLogParams = z.infer<typeof ResultsEventLogParamsSchema>;

export const ResultsLapChartDataParamsSchema = z.object({
  "subsession_id": z.number(),
  "simsession_number": z.number()
});
export type ResultsLapChartDataParams = z.infer<typeof ResultsLapChartDataParamsSchema>;

export const ResultsLapDataParamsSchema = z.object({
  "subsession_id": z.number(),
  "simsession_number": z.number(),
  "cust_id": z.number().optional(),
  "team_id": z.number().optional()
});
export type ResultsLapDataParams = z.infer<typeof ResultsLapDataParamsSchema>;

export const ResultsSearchHostedParamsSchema = z.object({
  "start_range_begin": z.string().optional(),
  "start_range_end": z.string().optional(),
  "finish_range_begin": z.string().optional(),
  "finish_range_end": z.string().optional(),
  "cust_id": z.number().optional(),
  "team_id": z.number().optional(),
  "host_cust_id": z.number().optional(),
  "session_name": z.string().optional(),
  "league_id": z.number().optional(),
  "league_season_id": z.number().optional(),
  "car_id": z.number().optional(),
  "track_id": z.number().optional(),
  "category_ids": z.array(z.number()).optional()
});
export type ResultsSearchHostedParams = z.infer<typeof ResultsSearchHostedParamsSchema>;

export const ResultsSearchSeriesParamsSchema = z.object({
  "season_year": z.number().optional(),
  "season_quarter": z.number().optional(),
  "start_range_begin": z.string().optional(),
  "start_range_end": z.string().optional(),
  "finish_range_begin": z.string().optional(),
  "finish_range_end": z.string().optional(),
  "cust_id": z.number().optional(),
  "team_id": z.number().optional(),
  "series_id": z.number().optional(),
  "race_week_num": z.number().optional(),
  "official_only": z.boolean().optional(),
  "event_types": z.array(z.number()).optional(),
  "category_ids": z.array(z.number()).optional()
});
export type ResultsSearchSeriesParams = z.infer<typeof ResultsSearchSeriesParamsSchema>;

export const ResultsSeasonResultsParamsSchema = z.object({
  "season_id": z.number(),
  "event_type": z.number().optional(),
  "race_week_num": z.number().optional()
});
export type ResultsSeasonResultsParams = z.infer<typeof ResultsSeasonResultsParamsSchema>;

export const SeasonListParamsSchema = z.object({
  "season_year": z.number(),
  "season_quarter": z.number()
});
export type SeasonListParams = z.infer<typeof SeasonListParamsSchema>;

export const SeasonRaceGuideParamsSchema = z.object({
  "from": z.string().optional(),
  "include_end_after_from": z.boolean().optional()
});
export type SeasonRaceGuideParams = z.infer<typeof SeasonRaceGuideParamsSchema>;

export const SeasonSpectatorSubsessionidsParamsSchema = z.object({
  "event_types": z.array(z.number()).optional()
});
export type SeasonSpectatorSubsessionidsParams = z.infer<typeof SeasonSpectatorSubsessionidsParamsSchema>;

export const SeasonSpectatorSubsessionidsDetailParamsSchema = z.object({
  "event_types": z.array(z.number()).optional(),
  "season_ids": z.array(z.number()).optional()
});
export type SeasonSpectatorSubsessionidsDetailParams = z.infer<typeof SeasonSpectatorSubsessionidsDetailParamsSchema>;

export const SeriesAssetsParamsSchema = z.object({});
export type SeriesAssetsParams = z.infer<typeof SeriesAssetsParamsSchema>;

export const SeriesGetParamsSchema = z.object({});
export type SeriesGetParams = z.infer<typeof SeriesGetParamsSchema>;

export const SeriesPastSeasonsParamsSchema = z.object({
  "series_id": z.number()
});
export type SeriesPastSeasonsParams = z.infer<typeof SeriesPastSeasonsParamsSchema>;

export const SeriesSeasonsParamsSchema = z.object({
  "include_series": z.boolean().optional(),
  "season_year": z.number().optional(),
  "season_quarter": z.number().optional()
});
export type SeriesSeasonsParams = z.infer<typeof SeriesSeasonsParamsSchema>;

export const SeriesSeasonListParamsSchema = z.object({
  "include_series": z.boolean().optional(),
  "season_year": z.number().optional(),
  "season_quarter": z.number().optional()
});
export type SeriesSeasonListParams = z.infer<typeof SeriesSeasonListParamsSchema>;

export const SeriesSeasonScheduleParamsSchema = z.object({
  "season_id": z.number()
});
export type SeriesSeasonScheduleParams = z.infer<typeof SeriesSeasonScheduleParamsSchema>;

export const SeriesStatsSeriesParamsSchema = z.object({});
export type SeriesStatsSeriesParams = z.infer<typeof SeriesStatsSeriesParamsSchema>;

export const StatsMemberBestsParamsSchema = z.object({
  "cust_id": z.number().optional(),
  "car_id": z.number().optional()
});
export type StatsMemberBestsParams = z.infer<typeof StatsMemberBestsParamsSchema>;

export const StatsMemberCareerParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type StatsMemberCareerParams = z.infer<typeof StatsMemberCareerParamsSchema>;

export const StatsMemberDivisionParamsSchema = z.object({
  "season_id": z.number(),
  "event_type": z.number()
});
export type StatsMemberDivisionParams = z.infer<typeof StatsMemberDivisionParamsSchema>;

export const StatsMemberRecapParamsSchema = z.object({
  "cust_id": z.number().optional(),
  "year": z.number().optional(),
  "season": z.number().optional()
});
export type StatsMemberRecapParams = z.infer<typeof StatsMemberRecapParamsSchema>;

export const StatsMemberRecentRacesParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type StatsMemberRecentRacesParams = z.infer<typeof StatsMemberRecentRacesParamsSchema>;

export const StatsMemberSummaryParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type StatsMemberSummaryParams = z.infer<typeof StatsMemberSummaryParamsSchema>;

export const StatsMemberYearlyParamsSchema = z.object({
  "cust_id": z.number().optional()
});
export type StatsMemberYearlyParams = z.infer<typeof StatsMemberYearlyParamsSchema>;

export const StatsSeasonDriverStandingsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "division": z.number().optional(),
  "race_week_num": z.number().optional()
});
export type StatsSeasonDriverStandingsParams = z.infer<typeof StatsSeasonDriverStandingsParamsSchema>;

export const StatsSeasonSupersessionStandingsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "division": z.number().optional(),
  "race_week_num": z.number().optional()
});
export type StatsSeasonSupersessionStandingsParams = z.infer<typeof StatsSeasonSupersessionStandingsParamsSchema>;

export const StatsSeasonTeamStandingsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "race_week_num": z.number().optional()
});
export type StatsSeasonTeamStandingsParams = z.infer<typeof StatsSeasonTeamStandingsParamsSchema>;

export const StatsSeasonTtStandingsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "division": z.number().optional(),
  "race_week_num": z.number().optional()
});
export type StatsSeasonTtStandingsParams = z.infer<typeof StatsSeasonTtStandingsParamsSchema>;

export const StatsSeasonTtResultsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "race_week_num": z.number(),
  "division": z.number().optional()
});
export type StatsSeasonTtResultsParams = z.infer<typeof StatsSeasonTtResultsParamsSchema>;

export const StatsSeasonQualifyResultsParamsSchema = z.object({
  "season_id": z.number(),
  "car_class_id": z.number(),
  "race_week_num": z.number(),
  "division": z.number().optional()
});
export type StatsSeasonQualifyResultsParams = z.infer<typeof StatsSeasonQualifyResultsParamsSchema>;

export const StatsWorldRecordsParamsSchema = z.object({
  "car_id": z.number(),
  "track_id": z.number(),
  "season_year": z.number().optional(),
  "season_quarter": z.number().optional()
});
export type StatsWorldRecordsParams = z.infer<typeof StatsWorldRecordsParamsSchema>;

export const TeamGetParamsSchema = z.object({
  "team_id": z.number(),
  "include_licenses": z.boolean().optional()
});
export type TeamGetParams = z.infer<typeof TeamGetParamsSchema>;

export const TeamMembershipParamsSchema = z.object({});
export type TeamMembershipParams = z.infer<typeof TeamMembershipParamsSchema>;

export const TimeAttackMemberSeasonResultsParamsSchema = z.object({
  "ta_comp_season_id": z.number()
});
export type TimeAttackMemberSeasonResultsParams = z.infer<typeof TimeAttackMemberSeasonResultsParamsSchema>;

export const TrackAssetsParamsSchema = z.object({});
export type TrackAssetsParams = z.infer<typeof TrackAssetsParamsSchema>;

export const TrackGetParamsSchema = z.object({});
export type TrackGetParams = z.infer<typeof TrackGetParamsSchema>;

export const CarAssetsResponseSchema = z.unknown();
export type CarAssetsResponse = z.infer<typeof CarAssetsResponseSchema>;

export const CarGetResponseSchema = z.unknown();
export type CarGetResponse = z.infer<typeof CarGetResponseSchema>;

export const CarclassGetResponseSchema = z.unknown();
export type CarclassGetResponse = z.infer<typeof CarclassGetResponseSchema>;

export const ConstantsCategoriesResponseSchema = z.unknown();
export type ConstantsCategoriesResponse = z.infer<typeof ConstantsCategoriesResponseSchema>;

export const ConstantsDivisionsResponseSchema = z.unknown();
export type ConstantsDivisionsResponse = z.infer<typeof ConstantsDivisionsResponseSchema>;

export const ConstantsEventTypesResponseSchema = z.unknown();
export type ConstantsEventTypesResponse = z.infer<typeof ConstantsEventTypesResponseSchema>;

export const DriverStatsByCategoryOvalResponseSchema = z.unknown();
export type DriverStatsByCategoryOvalResponse = z.infer<typeof DriverStatsByCategoryOvalResponseSchema>;

export const DriverStatsByCategorySportsCarResponseSchema = z.unknown();
export type DriverStatsByCategorySportsCarResponse = z.infer<typeof DriverStatsByCategorySportsCarResponseSchema>;

export const DriverStatsByCategoryFormulaCarResponseSchema = z.unknown();
export type DriverStatsByCategoryFormulaCarResponse = z.infer<typeof DriverStatsByCategoryFormulaCarResponseSchema>;

export const DriverStatsByCategoryRoadResponseSchema = z.unknown();
export type DriverStatsByCategoryRoadResponse = z.infer<typeof DriverStatsByCategoryRoadResponseSchema>;

export const DriverStatsByCategoryDirtOvalResponseSchema = z.unknown();
export type DriverStatsByCategoryDirtOvalResponse = z.infer<typeof DriverStatsByCategoryDirtOvalResponseSchema>;

export const DriverStatsByCategoryDirtRoadResponseSchema = z.unknown();
export type DriverStatsByCategoryDirtRoadResponse = z.infer<typeof DriverStatsByCategoryDirtRoadResponseSchema>;

export const HostedCombinedSessionsResponseSchema = z.unknown();
export type HostedCombinedSessionsResponse = z.infer<typeof HostedCombinedSessionsResponseSchema>;

export const HostedSessionsResponseSchema = z.unknown();
export type HostedSessionsResponse = z.infer<typeof HostedSessionsResponseSchema>;

export const LeagueCustLeagueSessionsResponseSchema = z.unknown();
export type LeagueCustLeagueSessionsResponse = z.infer<typeof LeagueCustLeagueSessionsResponseSchema>;

export const LeagueDirectoryResponseSchema = z.unknown();
export type LeagueDirectoryResponse = z.infer<typeof LeagueDirectoryResponseSchema>;

export const LeagueGetResponseSchema = z.unknown();
export type LeagueGetResponse = z.infer<typeof LeagueGetResponseSchema>;

export const LeagueGetPointsSystemsResponseSchema = z.unknown();
export type LeagueGetPointsSystemsResponse = z.infer<typeof LeagueGetPointsSystemsResponseSchema>;

export const LeagueMembershipResponseSchema = z.unknown();
export type LeagueMembershipResponse = z.infer<typeof LeagueMembershipResponseSchema>;

export const LeagueRosterResponseSchema = z.unknown();
export type LeagueRosterResponse = z.infer<typeof LeagueRosterResponseSchema>;

export const LeagueSeasonsResponseSchema = z.unknown();
export type LeagueSeasonsResponse = z.infer<typeof LeagueSeasonsResponseSchema>;

export const LeagueSeasonStandingsResponseSchema = z.unknown();
export type LeagueSeasonStandingsResponse = z.infer<typeof LeagueSeasonStandingsResponseSchema>;

export const LeagueSeasonSessionsResponseSchema = z.unknown();
export type LeagueSeasonSessionsResponse = z.infer<typeof LeagueSeasonSessionsResponseSchema>;

export const LookupCountriesResponseSchema = z.unknown();
export type LookupCountriesResponse = z.infer<typeof LookupCountriesResponseSchema>;

export const LookupDriversResponseSchema = z.unknown();
export type LookupDriversResponse = z.infer<typeof LookupDriversResponseSchema>;

export const LookupFlairsResponseSchema = z.unknown();
export type LookupFlairsResponse = z.infer<typeof LookupFlairsResponseSchema>;

export const LookupGetResponseSchema = z.unknown();
export type LookupGetResponse = z.infer<typeof LookupGetResponseSchema>;

export const LookupLicensesResponseSchema = z.unknown();
export type LookupLicensesResponse = z.infer<typeof LookupLicensesResponseSchema>;

export const MemberAwardsResponseSchema = z.unknown();
export type MemberAwardsResponse = z.infer<typeof MemberAwardsResponseSchema>;

export const MemberAwardInstancesResponseSchema = z.unknown();
export type MemberAwardInstancesResponse = z.infer<typeof MemberAwardInstancesResponseSchema>;

export const MemberChartDataResponseSchema = z.unknown();
export type MemberChartDataResponse = z.infer<typeof MemberChartDataResponseSchema>;

export const MemberGetResponseSchema = z.unknown();
export type MemberGetResponse = z.infer<typeof MemberGetResponseSchema>;

export const MemberInfoResponseSchema = z.unknown();
export type MemberInfoResponse = z.infer<typeof MemberInfoResponseSchema>;

export const MemberParticipationCreditsResponseSchema = z.unknown();
export type MemberParticipationCreditsResponse = z.infer<typeof MemberParticipationCreditsResponseSchema>;

export const MemberProfileResponseSchema = z.unknown();
export type MemberProfileResponse = z.infer<typeof MemberProfileResponseSchema>;

export const ResultsGetResponseSchema = z.unknown();
export type ResultsGetResponse = z.infer<typeof ResultsGetResponseSchema>;

export const ResultsEventLogResponseSchema = z.unknown();
export type ResultsEventLogResponse = z.infer<typeof ResultsEventLogResponseSchema>;

export const ResultsLapChartDataResponseSchema = z.unknown();
export type ResultsLapChartDataResponse = z.infer<typeof ResultsLapChartDataResponseSchema>;

export const ResultsLapDataResponseSchema = z.unknown();
export type ResultsLapDataResponse = z.infer<typeof ResultsLapDataResponseSchema>;

export const ResultsSearchHostedResponseSchema = z.unknown();
export type ResultsSearchHostedResponse = z.infer<typeof ResultsSearchHostedResponseSchema>;

export const ResultsSearchSeriesResponseSchema = z.unknown();
export type ResultsSearchSeriesResponse = z.infer<typeof ResultsSearchSeriesResponseSchema>;

export const ResultsSeasonResultsResponseSchema = z.unknown();
export type ResultsSeasonResultsResponse = z.infer<typeof ResultsSeasonResultsResponseSchema>;

export const SeasonListResponseSchema = z.unknown();
export type SeasonListResponse = z.infer<typeof SeasonListResponseSchema>;

export const SeasonRaceGuideResponseSchema = z.unknown();
export type SeasonRaceGuideResponse = z.infer<typeof SeasonRaceGuideResponseSchema>;

export const SeasonSpectatorSubsessionidsResponseSchema = z.unknown();
export type SeasonSpectatorSubsessionidsResponse = z.infer<typeof SeasonSpectatorSubsessionidsResponseSchema>;

export const SeasonSpectatorSubsessionidsDetailResponseSchema = z.unknown();
export type SeasonSpectatorSubsessionidsDetailResponse = z.infer<typeof SeasonSpectatorSubsessionidsDetailResponseSchema>;

export const SeriesAssetsResponseSchema = z.unknown();
export type SeriesAssetsResponse = z.infer<typeof SeriesAssetsResponseSchema>;

export const SeriesGetResponseSchema = z.unknown();
export type SeriesGetResponse = z.infer<typeof SeriesGetResponseSchema>;

export const SeriesPastSeasonsResponseSchema = z.unknown();
export type SeriesPastSeasonsResponse = z.infer<typeof SeriesPastSeasonsResponseSchema>;

export const SeriesSeasonsResponseSchema = z.unknown();
export type SeriesSeasonsResponse = z.infer<typeof SeriesSeasonsResponseSchema>;

export const SeriesSeasonListResponseSchema = z.unknown();
export type SeriesSeasonListResponse = z.infer<typeof SeriesSeasonListResponseSchema>;

export const SeriesSeasonScheduleResponseSchema = z.unknown();
export type SeriesSeasonScheduleResponse = z.infer<typeof SeriesSeasonScheduleResponseSchema>;

export const SeriesStatsSeriesResponseSchema = z.unknown();
export type SeriesStatsSeriesResponse = z.infer<typeof SeriesStatsSeriesResponseSchema>;

export const StatsMemberBestsResponseSchema = z.unknown();
export type StatsMemberBestsResponse = z.infer<typeof StatsMemberBestsResponseSchema>;

export const StatsMemberCareerResponseSchema = z.unknown();
export type StatsMemberCareerResponse = z.infer<typeof StatsMemberCareerResponseSchema>;

export const StatsMemberDivisionResponseSchema = z.unknown();
export type StatsMemberDivisionResponse = z.infer<typeof StatsMemberDivisionResponseSchema>;

export const StatsMemberRecapResponseSchema = z.unknown();
export type StatsMemberRecapResponse = z.infer<typeof StatsMemberRecapResponseSchema>;

export const StatsMemberRecentRacesResponseSchema = z.unknown();
export type StatsMemberRecentRacesResponse = z.infer<typeof StatsMemberRecentRacesResponseSchema>;

export const StatsMemberSummaryResponseSchema = z.unknown();
export type StatsMemberSummaryResponse = z.infer<typeof StatsMemberSummaryResponseSchema>;

export const StatsMemberYearlyResponseSchema = z.unknown();
export type StatsMemberYearlyResponse = z.infer<typeof StatsMemberYearlyResponseSchema>;

export const StatsSeasonDriverStandingsResponseSchema = z.unknown();
export type StatsSeasonDriverStandingsResponse = z.infer<typeof StatsSeasonDriverStandingsResponseSchema>;

export const StatsSeasonSupersessionStandingsResponseSchema = z.unknown();
export type StatsSeasonSupersessionStandingsResponse = z.infer<typeof StatsSeasonSupersessionStandingsResponseSchema>;

export const StatsSeasonTeamStandingsResponseSchema = z.unknown();
export type StatsSeasonTeamStandingsResponse = z.infer<typeof StatsSeasonTeamStandingsResponseSchema>;

export const StatsSeasonTtStandingsResponseSchema = z.unknown();
export type StatsSeasonTtStandingsResponse = z.infer<typeof StatsSeasonTtStandingsResponseSchema>;

export const StatsSeasonTtResultsResponseSchema = z.unknown();
export type StatsSeasonTtResultsResponse = z.infer<typeof StatsSeasonTtResultsResponseSchema>;

export const StatsSeasonQualifyResultsResponseSchema = z.unknown();
export type StatsSeasonQualifyResultsResponse = z.infer<typeof StatsSeasonQualifyResultsResponseSchema>;

export const StatsWorldRecordsResponseSchema = z.unknown();
export type StatsWorldRecordsResponse = z.infer<typeof StatsWorldRecordsResponseSchema>;

export const TeamGetResponseSchema = z.unknown();
export type TeamGetResponse = z.infer<typeof TeamGetResponseSchema>;

export const TeamMembershipResponseSchema = z.unknown();
export type TeamMembershipResponse = z.infer<typeof TeamMembershipResponseSchema>;

export const TimeAttackMemberSeasonResultsResponseSchema = z.unknown();
export type TimeAttackMemberSeasonResultsResponse = z.infer<typeof TimeAttackMemberSeasonResultsResponseSchema>;

export const TrackAssetsResponseSchema = z.unknown();
export type TrackAssetsResponse = z.infer<typeof TrackAssetsResponseSchema>;

export const TrackGetResponseSchema = z.unknown();
export type TrackGetResponse = z.infer<typeof TrackGetResponseSchema>;

// ---- Endpoint functions ----

export async function car_assets(client: IRacingClient): Promise<CarAssetsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/car/assets");
  return CarAssetsResponseSchema.parse(data);
}

export async function car_get(client: IRacingClient): Promise<CarGetResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/car/get");
  return CarGetResponseSchema.parse(data);
}

export async function carclass_get(client: IRacingClient): Promise<CarclassGetResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/carclass/get");
  return CarclassGetResponseSchema.parse(data);
}

export async function constants_categories(client: IRacingClient): Promise<ConstantsCategoriesResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/constants/categories");
  return ConstantsCategoriesResponseSchema.parse(data);
}

export async function constants_divisions(client: IRacingClient): Promise<ConstantsDivisionsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/constants/divisions");
  return ConstantsDivisionsResponseSchema.parse(data);
}

export async function constants_event_types(client: IRacingClient): Promise<ConstantsEventTypesResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/constants/event_types");
  return ConstantsEventTypesResponseSchema.parse(data);
}

export async function driver_stats_by_category_oval(client: IRacingClient): Promise<DriverStatsByCategoryOvalResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/oval");
  return DriverStatsByCategoryOvalResponseSchema.parse(data);
}

export async function driver_stats_by_category_sports_car(client: IRacingClient): Promise<DriverStatsByCategorySportsCarResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/sports_car");
  return DriverStatsByCategorySportsCarResponseSchema.parse(data);
}

export async function driver_stats_by_category_formula_car(client: IRacingClient): Promise<DriverStatsByCategoryFormulaCarResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/formula_car");
  return DriverStatsByCategoryFormulaCarResponseSchema.parse(data);
}

export async function driver_stats_by_category_road(client: IRacingClient): Promise<DriverStatsByCategoryRoadResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/road");
  return DriverStatsByCategoryRoadResponseSchema.parse(data);
}

export async function driver_stats_by_category_dirt_oval(client: IRacingClient): Promise<DriverStatsByCategoryDirtOvalResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_oval");
  return DriverStatsByCategoryDirtOvalResponseSchema.parse(data);
}

export async function driver_stats_by_category_dirt_road(client: IRacingClient): Promise<DriverStatsByCategoryDirtRoadResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/driver_stats_by_category/dirt_road");
  return DriverStatsByCategoryDirtRoadResponseSchema.parse(data);
}

export async function hosted_combined_sessions(client: IRacingClient, params: HostedCombinedSessionsParams): Promise<HostedCombinedSessionsResponse> {
  const parsed = HostedCombinedSessionsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/hosted/combined_sessions", parsed);
  return HostedCombinedSessionsResponseSchema.parse(data);
}

export async function hosted_sessions(client: IRacingClient): Promise<HostedSessionsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/hosted/sessions");
  return HostedSessionsResponseSchema.parse(data);
}

export async function league_cust_league_sessions(client: IRacingClient, params: LeagueCustLeagueSessionsParams): Promise<LeagueCustLeagueSessionsResponse> {
  const parsed = LeagueCustLeagueSessionsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/cust_league_sessions", parsed);
  return LeagueCustLeagueSessionsResponseSchema.parse(data);
}

export async function league_directory(client: IRacingClient, params: LeagueDirectoryParams): Promise<LeagueDirectoryResponse> {
  const parsed = LeagueDirectoryParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/directory", parsed);
  return LeagueDirectoryResponseSchema.parse(data);
}

export async function league_get(client: IRacingClient, params: LeagueGetParams): Promise<LeagueGetResponse> {
  const parsed = LeagueGetParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/get", parsed);
  return LeagueGetResponseSchema.parse(data);
}

export async function league_get_points_systems(client: IRacingClient, params: LeagueGetPointsSystemsParams): Promise<LeagueGetPointsSystemsResponse> {
  const parsed = LeagueGetPointsSystemsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/get_points_systems", parsed);
  return LeagueGetPointsSystemsResponseSchema.parse(data);
}

export async function league_membership(client: IRacingClient, params: LeagueMembershipParams): Promise<LeagueMembershipResponse> {
  const parsed = LeagueMembershipParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/membership", parsed);
  return LeagueMembershipResponseSchema.parse(data);
}

export async function league_roster(client: IRacingClient, params: LeagueRosterParams): Promise<LeagueRosterResponse> {
  const parsed = LeagueRosterParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/roster", parsed);
  return LeagueRosterResponseSchema.parse(data);
}

export async function league_seasons(client: IRacingClient, params: LeagueSeasonsParams): Promise<LeagueSeasonsResponse> {
  const parsed = LeagueSeasonsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/seasons", parsed);
  return LeagueSeasonsResponseSchema.parse(data);
}

export async function league_season_standings(client: IRacingClient, params: LeagueSeasonStandingsParams): Promise<LeagueSeasonStandingsResponse> {
  const parsed = LeagueSeasonStandingsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/season_standings", parsed);
  return LeagueSeasonStandingsResponseSchema.parse(data);
}

export async function league_season_sessions(client: IRacingClient, params: LeagueSeasonSessionsParams): Promise<LeagueSeasonSessionsResponse> {
  const parsed = LeagueSeasonSessionsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/league/season_sessions", parsed);
  return LeagueSeasonSessionsResponseSchema.parse(data);
}

export async function lookup_countries(client: IRacingClient): Promise<LookupCountriesResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/lookup/countries");
  return LookupCountriesResponseSchema.parse(data);
}

export async function lookup_drivers(client: IRacingClient, params: LookupDriversParams): Promise<LookupDriversResponse> {
  const parsed = LookupDriversParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/lookup/drivers", parsed);
  return LookupDriversResponseSchema.parse(data);
}

export async function lookup_flairs(client: IRacingClient): Promise<LookupFlairsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/lookup/flairs");
  return LookupFlairsResponseSchema.parse(data);
}

export async function lookup_get(client: IRacingClient): Promise<LookupGetResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/lookup/get");
  return LookupGetResponseSchema.parse(data);
}

export async function lookup_licenses(client: IRacingClient): Promise<LookupLicensesResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/lookup/licenses");
  return LookupLicensesResponseSchema.parse(data);
}

export async function member_awards(client: IRacingClient, params: MemberAwardsParams): Promise<MemberAwardsResponse> {
  const parsed = MemberAwardsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/awards", parsed);
  return MemberAwardsResponseSchema.parse(data);
}

export async function member_award_instances(client: IRacingClient, params: MemberAwardInstancesParams): Promise<MemberAwardInstancesResponse> {
  const parsed = MemberAwardInstancesParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/award_instances", parsed);
  return MemberAwardInstancesResponseSchema.parse(data);
}

export async function member_chart_data(client: IRacingClient, params: MemberChartDataParams): Promise<MemberChartDataResponse> {
  const parsed = MemberChartDataParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/chart_data", parsed);
  return MemberChartDataResponseSchema.parse(data);
}

export async function member_get(client: IRacingClient, params: MemberGetParams): Promise<MemberGetResponse> {
  const parsed = MemberGetParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/get", parsed);
  return MemberGetResponseSchema.parse(data);
}

export async function member_info(client: IRacingClient): Promise<MemberInfoResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/info");
  return MemberInfoResponseSchema.parse(data);
}

export async function member_participation_credits(client: IRacingClient): Promise<MemberParticipationCreditsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/participation_credits");
  return MemberParticipationCreditsResponseSchema.parse(data);
}

export async function member_profile(client: IRacingClient, params: MemberProfileParams): Promise<MemberProfileResponse> {
  const parsed = MemberProfileParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/member/profile", parsed);
  return MemberProfileResponseSchema.parse(data);
}

export async function results_get(client: IRacingClient, params: ResultsGetParams): Promise<ResultsGetResponse> {
  const parsed = ResultsGetParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/get", parsed);
  return ResultsGetResponseSchema.parse(data);
}

export async function results_event_log(client: IRacingClient, params: ResultsEventLogParams): Promise<ResultsEventLogResponse> {
  const parsed = ResultsEventLogParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/event_log", parsed);
  return ResultsEventLogResponseSchema.parse(data);
}

export async function results_lap_chart_data(client: IRacingClient, params: ResultsLapChartDataParams): Promise<ResultsLapChartDataResponse> {
  const parsed = ResultsLapChartDataParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/lap_chart_data", parsed);
  return ResultsLapChartDataResponseSchema.parse(data);
}

export async function results_lap_data(client: IRacingClient, params: ResultsLapDataParams): Promise<ResultsLapDataResponse> {
  const parsed = ResultsLapDataParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/lap_data", parsed);
  return ResultsLapDataResponseSchema.parse(data);
}

export async function results_search_hosted(client: IRacingClient, params: ResultsSearchHostedParams): Promise<ResultsSearchHostedResponse> {
  const parsed = ResultsSearchHostedParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/search_hosted", parsed);
  return ResultsSearchHostedResponseSchema.parse(data);
}

export async function results_search_series(client: IRacingClient, params: ResultsSearchSeriesParams): Promise<ResultsSearchSeriesResponse> {
  const parsed = ResultsSearchSeriesParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/search_series", parsed);
  return ResultsSearchSeriesResponseSchema.parse(data);
}

export async function results_season_results(client: IRacingClient, params: ResultsSeasonResultsParams): Promise<ResultsSeasonResultsResponse> {
  const parsed = ResultsSeasonResultsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/results/season_results", parsed);
  return ResultsSeasonResultsResponseSchema.parse(data);
}

export async function season_list(client: IRacingClient, params: SeasonListParams): Promise<SeasonListResponse> {
  const parsed = SeasonListParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/season/list", parsed);
  return SeasonListResponseSchema.parse(data);
}

export async function season_race_guide(client: IRacingClient, params: SeasonRaceGuideParams): Promise<SeasonRaceGuideResponse> {
  const parsed = SeasonRaceGuideParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/season/race_guide", parsed);
  return SeasonRaceGuideResponseSchema.parse(data);
}

export async function season_spectator_subsessionids(client: IRacingClient, params: SeasonSpectatorSubsessionidsParams): Promise<SeasonSpectatorSubsessionidsResponse> {
  const parsed = SeasonSpectatorSubsessionidsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/season/spectator_subsessionids", parsed);
  return SeasonSpectatorSubsessionidsResponseSchema.parse(data);
}

export async function season_spectator_subsessionids_detail(client: IRacingClient, params: SeasonSpectatorSubsessionidsDetailParams): Promise<SeasonSpectatorSubsessionidsDetailResponse> {
  const parsed = SeasonSpectatorSubsessionidsDetailParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/season/spectator_subsessionids_detail", parsed);
  return SeasonSpectatorSubsessionidsDetailResponseSchema.parse(data);
}

export async function series_assets(client: IRacingClient): Promise<SeriesAssetsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/assets");
  return SeriesAssetsResponseSchema.parse(data);
}

export async function series_get(client: IRacingClient): Promise<SeriesGetResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/get");
  return SeriesGetResponseSchema.parse(data);
}

export async function series_past_seasons(client: IRacingClient, params: SeriesPastSeasonsParams): Promise<SeriesPastSeasonsResponse> {
  const parsed = SeriesPastSeasonsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/past_seasons", parsed);
  return SeriesPastSeasonsResponseSchema.parse(data);
}

export async function series_seasons(client: IRacingClient, params: SeriesSeasonsParams): Promise<SeriesSeasonsResponse> {
  const parsed = SeriesSeasonsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/seasons", parsed);
  return SeriesSeasonsResponseSchema.parse(data);
}

export async function series_season_list(client: IRacingClient, params: SeriesSeasonListParams): Promise<SeriesSeasonListResponse> {
  const parsed = SeriesSeasonListParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/season_list", parsed);
  return SeriesSeasonListResponseSchema.parse(data);
}

export async function series_season_schedule(client: IRacingClient, params: SeriesSeasonScheduleParams): Promise<SeriesSeasonScheduleResponse> {
  const parsed = SeriesSeasonScheduleParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/season_schedule", parsed);
  return SeriesSeasonScheduleResponseSchema.parse(data);
}

export async function series_stats_series(client: IRacingClient): Promise<SeriesStatsSeriesResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/series/stats_series");
  return SeriesStatsSeriesResponseSchema.parse(data);
}

export async function stats_member_bests(client: IRacingClient, params: StatsMemberBestsParams): Promise<StatsMemberBestsResponse> {
  const parsed = StatsMemberBestsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_bests", parsed);
  return StatsMemberBestsResponseSchema.parse(data);
}

export async function stats_member_career(client: IRacingClient, params: StatsMemberCareerParams): Promise<StatsMemberCareerResponse> {
  const parsed = StatsMemberCareerParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_career", parsed);
  return StatsMemberCareerResponseSchema.parse(data);
}

export async function stats_member_division(client: IRacingClient, params: StatsMemberDivisionParams): Promise<StatsMemberDivisionResponse> {
  const parsed = StatsMemberDivisionParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_division", parsed);
  return StatsMemberDivisionResponseSchema.parse(data);
}

export async function stats_member_recap(client: IRacingClient, params: StatsMemberRecapParams): Promise<StatsMemberRecapResponse> {
  const parsed = StatsMemberRecapParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_recap", parsed);
  return StatsMemberRecapResponseSchema.parse(data);
}

export async function stats_member_recent_races(client: IRacingClient, params: StatsMemberRecentRacesParams): Promise<StatsMemberRecentRacesResponse> {
  const parsed = StatsMemberRecentRacesParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_recent_races", parsed);
  return StatsMemberRecentRacesResponseSchema.parse(data);
}

export async function stats_member_summary(client: IRacingClient, params: StatsMemberSummaryParams): Promise<StatsMemberSummaryResponse> {
  const parsed = StatsMemberSummaryParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_summary", parsed);
  return StatsMemberSummaryResponseSchema.parse(data);
}

export async function stats_member_yearly(client: IRacingClient, params: StatsMemberYearlyParams): Promise<StatsMemberYearlyResponse> {
  const parsed = StatsMemberYearlyParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/member_yearly", parsed);
  return StatsMemberYearlyResponseSchema.parse(data);
}

export async function stats_season_driver_standings(client: IRacingClient, params: StatsSeasonDriverStandingsParams): Promise<StatsSeasonDriverStandingsResponse> {
  const parsed = StatsSeasonDriverStandingsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_driver_standings", parsed);
  return StatsSeasonDriverStandingsResponseSchema.parse(data);
}

export async function stats_season_supersession_standings(client: IRacingClient, params: StatsSeasonSupersessionStandingsParams): Promise<StatsSeasonSupersessionStandingsResponse> {
  const parsed = StatsSeasonSupersessionStandingsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_supersession_standings", parsed);
  return StatsSeasonSupersessionStandingsResponseSchema.parse(data);
}

export async function stats_season_team_standings(client: IRacingClient, params: StatsSeasonTeamStandingsParams): Promise<StatsSeasonTeamStandingsResponse> {
  const parsed = StatsSeasonTeamStandingsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_team_standings", parsed);
  return StatsSeasonTeamStandingsResponseSchema.parse(data);
}

export async function stats_season_tt_standings(client: IRacingClient, params: StatsSeasonTtStandingsParams): Promise<StatsSeasonTtStandingsResponse> {
  const parsed = StatsSeasonTtStandingsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_tt_standings", parsed);
  return StatsSeasonTtStandingsResponseSchema.parse(data);
}

export async function stats_season_tt_results(client: IRacingClient, params: StatsSeasonTtResultsParams): Promise<StatsSeasonTtResultsResponse> {
  const parsed = StatsSeasonTtResultsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_tt_results", parsed);
  return StatsSeasonTtResultsResponseSchema.parse(data);
}

export async function stats_season_qualify_results(client: IRacingClient, params: StatsSeasonQualifyResultsParams): Promise<StatsSeasonQualifyResultsResponse> {
  const parsed = StatsSeasonQualifyResultsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/season_qualify_results", parsed);
  return StatsSeasonQualifyResultsResponseSchema.parse(data);
}

export async function stats_world_records(client: IRacingClient, params: StatsWorldRecordsParams): Promise<StatsWorldRecordsResponse> {
  const parsed = StatsWorldRecordsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/stats/world_records", parsed);
  return StatsWorldRecordsResponseSchema.parse(data);
}

export async function team_get(client: IRacingClient, params: TeamGetParams): Promise<TeamGetResponse> {
  const parsed = TeamGetParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/team/get", parsed);
  return TeamGetResponseSchema.parse(data);
}

export async function team_membership(client: IRacingClient): Promise<TeamMembershipResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/team/membership");
  return TeamMembershipResponseSchema.parse(data);
}

export async function time_attack_member_season_results(client: IRacingClient, params: TimeAttackMemberSeasonResultsParams): Promise<TimeAttackMemberSeasonResultsResponse> {
  const parsed = TimeAttackMemberSeasonResultsParamsSchema.parse(params);
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/time_attack/member_season_results", parsed);
  return TimeAttackMemberSeasonResultsResponseSchema.parse(data);
}

export async function track_assets(client: IRacingClient): Promise<TrackAssetsResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/track/assets");
  return TrackAssetsResponseSchema.parse(data);
}

export async function track_get(client: IRacingClient): Promise<TrackGetResponse> {
  
  const data = await client.getDeep<unknown>("https://members-ng.iracing.com/data/track/get");
  return TrackGetResponseSchema.parse(data);
}
