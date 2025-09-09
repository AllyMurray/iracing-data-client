/* AUTO-GENERATED — do not edit */

import { IRacingClient, IRacingError, type IRacingClientOptions } from "./client";
import { CarService } from "./services/car.service";
import { CarclassService } from "./services/carclass.service";
import { ConstantsService } from "./services/constants.service";
import { DriverStatsByCategoryService } from "./services/driver-stats-by-category.service";
import { HostedService } from "./services/hosted.service";
import { LeagueService } from "./services/league.service";
import { LookupService } from "./services/lookup.service";
import { MemberService } from "./services/member.service";
import { ResultsService } from "./services/results.service";
import { SeasonService } from "./services/season.service";
import { SeriesService } from "./services/series.service";
import { StatsService } from "./services/stats.service";
import { TeamService } from "./services/team.service";
import { TimeAttackService } from "./services/time-attack.service";
import { TrackService } from "./services/track.service";

export { IRacingClient, IRacingError, type IRacingClientOptions };

export * from "./services/car.types";
export * from "./services/carclass.types";
export * from "./services/constants.types";
export * from "./services/driver-stats-by-category.types";
export * from "./services/hosted.types";
export * from "./services/league.types";
export * from "./services/lookup.types";
export * from "./services/member.types";
export * from "./services/results.types";
export * from "./services/season.types";
export * from "./services/series.types";
export * from "./services/stats.types";
export * from "./services/team.types";
export * from "./services/time-attack.types";
export * from "./services/track.types";

export class IRacingSDK {
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

  constructor(opts: IRacingClientOptions = {}) {
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
}