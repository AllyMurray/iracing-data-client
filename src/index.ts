/* AUTO-GENERATED — do not edit */

import { DEFAULT_RETRY_OPTIONS, IRacingClient, IRacingError, type IRacingClientOptions, type IRacingErrorOptions } from "./client";
import { CarService } from "./car/service";
import { CarclassService } from "./carclass/service";
import { ConstantsService } from "./constants/service";
import { DriverStatsByCategoryService } from "./driver-stats-by-category/service";
import { HostedService } from "./hosted/service";
import { LeagueService } from "./league/service";
import { LookupService } from "./lookup/service";
import { MemberService } from "./member/service";
import { ResultsService } from "./results/service";
import { SeasonService } from "./season/service";
import { SeriesService } from "./series/service";
import { StatsService } from "./stats/service";
import { TeamService } from "./team/service";
import { TimeAttackService } from "./time-attack/service";
import { TrackService } from "./track/service";

// Re-export client
export { DEFAULT_RETRY_OPTIONS, IRacingClient, IRacingError, type IRacingClientOptions, type IRacingErrorOptions };

// Re-export http-client-toolkit types
export type {
  HttpClientEvent,
  HttpClientEventType,
  HttpClientObservabilityOptions,
  HttpClientRateLimitOptions,
  HttpClientStores,
  PerRequestCacheOptions,
  RetryContext,
  RetryOptions,
} from '@http-client-toolkit/core';

// Re-export auth types and helpers
export type {
  AuthConfig,
  PasswordLimitedAuth,
  AuthorizationCodeAuth,
  TokenResponse,
  OnTokenRefresh,
  FetchLike,
} from "./auth";

export {
  OAuthError,
  TokenRefreshError,
  buildAuthorizationUrl,
  exchangeAuthorizationCode,
} from "./auth";

export * from "./car/types";
export * from "./carclass/types";
export * from "./constants/types";
export * from "./driver-stats-by-category/types";
export * from "./hosted/types";
export * from "./league/types";
export * from "./lookup/types";
export * from "./member/types";
export * from "./results/types";
export * from "./season/types";
export * from "./series/types";
export * from "./stats/types";
export * from "./team/types";
export * from "./time-attack/types";
export * from "./track/types";

export class IRacingDataClient {
  private client: IRacingClient;

  public car: CarService;
  public carclass: CarclassService;
  public constants: ConstantsService;
  public driverStatsByCategory: DriverStatsByCategoryService;
  public hosted: HostedService;
  public league: LeagueService;
  public lookup: LookupService;
  public member: MemberService;
  public results: ResultsService;
  public season: SeasonService;
  public series: SeriesService;
  public stats: StatsService;
  public team: TeamService;
  public timeAttack: TimeAttackService;
  public track: TrackService;

  constructor(opts: IRacingClientOptions) {
    this.client = new IRacingClient(opts);

    this.car = new CarService(this.client);
    this.carclass = new CarclassService(this.client);
    this.constants = new ConstantsService(this.client);
    this.driverStatsByCategory = new DriverStatsByCategoryService(this.client);
    this.hosted = new HostedService(this.client);
    this.league = new LeagueService(this.client);
    this.lookup = new LookupService(this.client);
    this.member = new MemberService(this.client);
    this.results = new ResultsService(this.client);
    this.season = new SeasonService(this.client);
    this.series = new SeriesService(this.client);
    this.stats = new StatsService(this.client);
    this.team = new TeamService(this.client);
    this.timeAttack = new TimeAttackService(this.client);
    this.track = new TrackService(this.client);
  }

  /**
   * Returns the number of currently in-flight requests.
   * Pass a resource key to scope the count to a single rate-limit bucket.
   */
  getPendingRequestCount(resourceKey?: string): number {
    return this.client.getPendingRequestCount(resourceKey);
  }
}
