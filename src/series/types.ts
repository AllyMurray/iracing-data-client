import * as z from "zod/mini";

// ---- Response Types ----

export interface SeriesAssetsItem {
  largeImage: null; // maps from: large_image
  logo: string;
  seriesCopy: string; // maps from: series_copy
  seriesId: number; // maps from: series_id
  smallImage: null; // maps from: small_image
}

export interface SeriesAssetsResponse {
  [key: string]: SeriesAssetsItem;
}

export interface SeriesGetItem {
  allowedLicenses: any[]; // maps from: allowed_licenses
  category: string;
  categoryId: number; // maps from: category_id
  eligible: boolean;
  firstSeason: any; // maps from: first_season
  forumUrl: string; // maps from: forum_url
  maxStarters: number; // maps from: max_starters
  minStarters: number; // maps from: min_starters
  ovalCautionType: number; // maps from: oval_caution_type
  roadCautionType: number; // maps from: road_caution_type
  seriesId: number; // maps from: series_id
  seriesName: string; // maps from: series_name
  seriesShortName: string; // maps from: series_short_name
}

export type SeriesGetResponse = SeriesGetItem[];

export interface SeriesSeasonsItem {
  seasonId: number; // maps from: season_id
  seasonName: string; // maps from: season_name
  active: boolean;
  allowedSeasonMembers: null; // maps from: allowed_season_members
  carClassIds: number[]; // maps from: car_class_ids
  carSwitching: boolean; // maps from: car_switching
  carTypes: any[]; // maps from: car_types
  cautionLapsDoNotCount: boolean; // maps from: caution_laps_do_not_count
  complete: boolean;
  connectionBlackFlag: boolean; // maps from: connection_black_flag
  consecCautionWithinNlaps: number; // maps from: consec_caution_within_nlaps
  consecCautionsSingleFile: boolean; // maps from: consec_cautions_single_file
  crossLicense: boolean; // maps from: cross_license
  distributedMatchmaking: boolean; // maps from: distributed_matchmaking
  driverChangeRule: number; // maps from: driver_change_rule
  driverChanges: boolean; // maps from: driver_changes
  drops: number;
  enablePitlaneCollisions: boolean; // maps from: enable_pitlane_collisions
  fixedSetup: boolean; // maps from: fixed_setup
  greenWhiteCheckeredLimit: number; // maps from: green_white_checkered_limit
  gridByClass: boolean; // maps from: grid_by_class
  hardcoreLevel: number; // maps from: hardcore_level
  hasSupersessions: boolean; // maps from: has_supersessions
  ignoreLicenseForPractice: boolean; // maps from: ignore_license_for_practice
  incidentLimit: number; // maps from: incident_limit
  incidentWarnMode: number; // maps from: incident_warn_mode
  incidentWarnParam1: number; // maps from: incident_warn_param1
  incidentWarnParam2: number; // maps from: incident_warn_param2
  isHeatRacing: boolean; // maps from: is_heat_racing
  licenseGroup: number; // maps from: license_group
  licenseGroupTypes: any[]; // maps from: license_group_types
  luckyDog: boolean; // maps from: lucky_dog
  maxTeamDrivers: number; // maps from: max_team_drivers
  maxWeeks: number; // maps from: max_weeks
  minTeamDrivers: number; // maps from: min_team_drivers
  multiclass: boolean;
  mustUseDiffTireTypesInRace: boolean; // maps from: must_use_diff_tire_types_in_race
  nextRaceSession: null; // maps from: next_race_session
  numFastTows: number; // maps from: num_fast_tows
  numOptLaps: number; // maps from: num_opt_laps
  official: boolean;
  opDuration: number; // maps from: op_duration
  openPracticeSessionTypeId: number; // maps from: open_practice_session_type_id
  qualifierMustStartRace: boolean; // maps from: qualifier_must_start_race
  raceWeek: number; // maps from: race_week
  raceWeekToMakeDivisions: number; // maps from: race_week_to_make_divisions
  regUserCount: number; // maps from: reg_user_count
  regionCompetition: boolean; // maps from: region_competition
  restrictByMember: boolean; // maps from: restrict_by_member
  restrictToCar: boolean; // maps from: restrict_to_car
  restrictViewing: boolean; // maps from: restrict_viewing
  scheduleDescription: string; // maps from: schedule_description
  schedules: any[];
  seasonQuarter: number; // maps from: season_quarter
  seasonShortName: string; // maps from: season_short_name
  seasonYear: number; // maps from: season_year
  sendToOpenPractice: boolean; // maps from: send_to_open_practice
  seriesId: number; // maps from: series_id
  shortParadeLap: boolean; // maps from: short_parade_lap
  startDate: string; // maps from: start_date
  startOnQualTire: boolean; // maps from: start_on_qual_tire
  startZone: boolean; // maps from: start_zone
  trackTypes: any[]; // maps from: track_types
  unsportConductRuleMode: number; // maps from: unsport_conduct_rule_mode
}

export type SeriesSeasonsResponse = SeriesSeasonsItem[];

export interface SeriesSeasonListResponse {
  seasons: any[];
}

export interface SeriesStatsSeriesItem {
  seriesId: number; // maps from: series_id
  seriesName: string; // maps from: series_name
  seriesShortName: string; // maps from: series_short_name
  categoryId: number; // maps from: category_id
  category: string;
  active: boolean;
  official: boolean;
  fixedSetup: boolean; // maps from: fixed_setup
  logo: null;
  licenseGroup: number; // maps from: license_group
  licenseGroupTypes: any[]; // maps from: license_group_types
  allowedLicenses: any[]; // maps from: allowed_licenses
  seasons: any[];
}

export type SeriesStatsSeriesResponse = SeriesStatsSeriesItem[];

// ---- Response Schemas ----

const SeriesAssetsSchema = z.record(z.string(), z.object({
  largeImage: z.union([z.string(), z.literal(""), z.null()]),
  logo: z.union([z.string(), z.literal("")]),
  seriesCopy: z.string(),
  seriesId: z.number(),
  smallImage: z.union([z.string(), z.literal(""), z.null()])
}));

const SeriesGetSchema = z.array(z.object({
  allowedLicenses: z.array(z.object({
  groupName: z.union([z.string(), z.literal("")]),
  licenseGroup: z.number(),
  maxLicenseLevel: z.number(),
  minLicenseLevel: z.number()
})),
  category: z.string(),
  categoryId: z.number(),
  eligible: z.boolean(),
  firstSeason: z.object({
  seasonYear: z.number(),
  seasonQuarter: z.number()
}),
  forumUrl: z.union([z.string(), z.literal("")]),
  maxStarters: z.number(),
  minStarters: z.number(),
  ovalCautionType: z.number(),
  roadCautionType: z.number(),
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string()
}));

const SeriesSeasonsSchema = z.array(z.object({
  seasonId: z.number(),
  seasonName: z.string(),
  active: z.boolean(),
  allowedSeasonMembers: z.union([z.string(), z.literal(""), z.null()]),
  carClassIds: z.array(z.number()),
  carSwitching: z.boolean(),
  carTypes: z.array(z.object({
  carType: z.string()
})),
  cautionLapsDoNotCount: z.boolean(),
  complete: z.boolean(),
  connectionBlackFlag: z.boolean(),
  consecCautionWithinNlaps: z.number(),
  consecCautionsSingleFile: z.boolean(),
  crossLicense: z.boolean(),
  distributedMatchmaking: z.boolean(),
  driverChangeRule: z.number(),
  driverChanges: z.boolean(),
  drops: z.number(),
  enablePitlaneCollisions: z.boolean(),
  fixedSetup: z.boolean(),
  greenWhiteCheckeredLimit: z.number(),
  gridByClass: z.boolean(),
  hardcoreLevel: z.number(),
  hasSupersessions: z.boolean(),
  ignoreLicenseForPractice: z.boolean(),
  incidentLimit: z.number(),
  incidentWarnMode: z.number(),
  incidentWarnParam1: z.number(),
  incidentWarnParam2: z.number(),
  isHeatRacing: z.boolean(),
  licenseGroup: z.number(),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  luckyDog: z.boolean(),
  maxTeamDrivers: z.number(),
  maxWeeks: z.number(),
  minTeamDrivers: z.number(),
  multiclass: z.boolean(),
  mustUseDiffTireTypesInRace: z.boolean(),
  nextRaceSession: z.union([z.string(), z.literal(""), z.null()]),
  numFastTows: z.number(),
  numOptLaps: z.number(),
  official: z.boolean(),
  opDuration: z.number(),
  openPracticeSessionTypeId: z.number(),
  qualifierMustStartRace: z.boolean(),
  raceWeek: z.number(),
  raceWeekToMakeDivisions: z.number(),
  regUserCount: z.number(),
  regionCompetition: z.boolean(),
  restrictByMember: z.boolean(),
  restrictToCar: z.boolean(),
  restrictViewing: z.boolean(),
  scheduleDescription: z.string(),
  schedules: z.array(z.object({
  seasonId: z.number(),
  raceWeekNum: z.number(),
  carRestrictions: z.array(z.object({
  carId: z.number(),
  maxDryTireSets: z.number(),
  maxPctFuelFill: z.number(),
  powerAdjustPct: z.number(),
  weightPenaltyKg: z.number()
})),
  category: z.string(),
  categoryId: z.number(),
  enablePitlaneCollisions: z.boolean(),
  fullCourseCautions: z.boolean(),
  practiceLength: z.number(),
  qualAttached: z.boolean(),
  qualifyLaps: z.number(),
  qualifyLength: z.number(),
  raceLapLimit: z.number(),
  raceTimeDescriptors: z.array(z.object({
  dayOffset: z.array(z.number()),
  firstSessionTime: z.string(),
  repeatMinutes: z.number(),
  repeating: z.boolean(),
  sessionMinutes: z.number(),
  startDate: z.string(),
  superSession: z.boolean()
})),
  raceTimeLimit: z.union([z.string(), z.literal(""), z.null()]),
  raceWeekCarClassIds: z.array(z.unknown()),
  raceWeekCars: z.array(z.unknown()),
  restartType: z.string(),
  scheduleName: z.string(),
  seasonName: z.string(),
  seriesId: z.number(),
  seriesName: z.string(),
  shortParadeLap: z.boolean(),
  specialEventType: z.union([z.string(), z.literal(""), z.null()]),
  startDate: z.string(),
  startType: z.string(),
  startZone: z.boolean(),
  track: z.object({
  category: z.string(),
  categoryId: z.number(),
  configName: z.string(),
  trackId: z.number(),
  trackName: z.string()
}),
  trackState: z.object({
  leaveMarbles: z.boolean()
}),
  warmupLength: z.number(),
  weather: z.object({
  allowFog: z.boolean(),
  forecastOptions: z.object({
  allowFog: z.boolean(),
  forecastType: z.number(),
  precipitation: z.number(),
  skies: z.number(),
  stopPrecip: z.number(),
  temperature: z.number(),
  weatherSeed: z.number(),
  windDir: z.number(),
  windSpeed: z.number()
}),
  precipOption: z.number(),
  relHumidity: z.number(),
  simulatedStartTime: z.string(),
  simulatedTimeMultiplier: z.number(),
  simulatedTimeOffsets: z.array(z.number()),
  skies: z.number(),
  tempUnits: z.number(),
  tempValue: z.number(),
  timeOfDay: z.number(),
  trackWater: z.number(),
  version: z.number(),
  weatherSummary: z.object({
  maxPrecipRate: z.number(),
  maxPrecipRateDesc: z.string(),
  precipChance: z.number(),
  skiesHigh: z.number(),
  skiesLow: z.number(),
  tempHigh: z.number(),
  tempLow: z.number(),
  tempUnits: z.number(),
  windDir: z.number(),
  windHigh: z.number(),
  windLow: z.number(),
  windUnits: z.number()
}),
  weatherUrl: z.string(),
  windDir: z.number(),
  windUnits: z.number(),
  windValue: z.number()
}),
  weekEndTime: z.string()
})),
  seasonQuarter: z.number(),
  seasonShortName: z.string(),
  seasonYear: z.number(),
  sendToOpenPractice: z.boolean(),
  seriesId: z.number(),
  shortParadeLap: z.boolean(),
  startDate: z.string(),
  startOnQualTire: z.boolean(),
  startZone: z.boolean(),
  trackTypes: z.array(z.object({
  trackType: z.string()
})),
  unsportConductRuleMode: z.number()
}));

const SeriesSeasonListSchema = z.object({
  seasons: z.array(z.object({
  seasonId: z.number(),
  seasonName: z.string(),
  active: z.boolean(),
  allowedSeasonMembers: z.union([z.string(), z.literal(""), z.null()]),
  carClassIds: z.array(z.number()),
  carSwitching: z.boolean(),
  carTypes: z.array(z.object({
  carType: z.string()
})),
  cautionLapsDoNotCount: z.boolean(),
  complete: z.boolean(),
  connectionBlackFlag: z.boolean(),
  consecCautionWithinNlaps: z.number(),
  consecCautionsSingleFile: z.boolean(),
  crossLicense: z.boolean(),
  currentWeekSched: z.object({
  raceWeekNum: z.number(),
  track: z.object({
  category: z.string(),
  categoryId: z.number(),
  configName: z.string(),
  trackId: z.number(),
  trackName: z.string()
}),
  carRestrictions: z.array(z.object({
  carId: z.number(),
  maxDryTireSets: z.number(),
  maxPctFuelFill: z.number(),
  powerAdjustPct: z.number(),
  weightPenaltyKg: z.number()
})),
  raceLapLimit: z.number(),
  raceTimeLimit: z.union([z.string(), z.literal(""), z.null()]),
  precipChance: z.number(),
  startType: z.string(),
  categoryId: z.number()
}),
  distributedMatchmaking: z.boolean(),
  driverChangeRule: z.number(),
  driverChanges: z.boolean(),
  drops: z.number(),
  elig: z.object({
  ownCar: z.boolean(),
  ownTrack: z.boolean()
}),
  enablePitlaneCollisions: z.boolean(),
  fixedSetup: z.boolean(),
  greenWhiteCheckeredLimit: z.number(),
  gridByClass: z.boolean(),
  hardcoreLevel: z.number(),
  hasMpr: z.boolean(),
  hasSupersessions: z.boolean(),
  ignoreLicenseForPractice: z.boolean(),
  incidentLimit: z.number(),
  incidentWarnMode: z.number(),
  incidentWarnParam1: z.number(),
  incidentWarnParam2: z.number(),
  isHeatRacing: z.boolean(),
  licenseGroup: z.number(),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  luckyDog: z.boolean(),
  maxTeamDrivers: z.number(),
  maxWeeks: z.number(),
  minTeamDrivers: z.number(),
  multiclass: z.boolean(),
  mustUseDiffTireTypesInRace: z.boolean(),
  numFastTows: z.number(),
  numOptLaps: z.number(),
  official: z.boolean(),
  opDuration: z.number(),
  openPracticeSessionTypeId: z.number(),
  qualifierMustStartRace: z.boolean(),
  raceWeek: z.number(),
  raceWeekToMakeDivisions: z.number(),
  regUserCount: z.number(),
  regionCompetition: z.boolean(),
  restrictByMember: z.boolean(),
  restrictToCar: z.boolean(),
  restrictViewing: z.boolean(),
  scheduleDescription: z.string(),
  seasonQuarter: z.number(),
  seasonShortName: z.string(),
  seasonYear: z.number(),
  sendToOpenPractice: z.boolean(),
  seriesId: z.number(),
  shortParadeLap: z.boolean(),
  startDate: z.string(),
  startOnQualTire: z.boolean(),
  startZone: z.boolean(),
  trackTypes: z.array(z.object({
  trackType: z.string()
})),
  unsportConductRuleMode: z.number()
}))
});

const SeriesStatsSeriesSchema = z.array(z.object({
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string(),
  categoryId: z.number(),
  category: z.string(),
  active: z.boolean(),
  official: z.boolean(),
  fixedSetup: z.boolean(),
  logo: z.union([z.string(), z.literal(""), z.null()]),
  licenseGroup: z.number(),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  allowedLicenses: z.array(z.object({
  groupName: z.union([z.string(), z.literal("")]),
  licenseGroup: z.number(),
  maxLicenseLevel: z.number(),
  minLicenseLevel: z.number(),
  parentId: z.number()
})),
  seasons: z.array(z.object({
  seasonId: z.number(),
  seriesId: z.number(),
  seasonName: z.string(),
  seasonShortName: z.string(),
  seasonYear: z.number(),
  seasonQuarter: z.number(),
  active: z.boolean(),
  official: z.boolean(),
  driverChanges: z.boolean(),
  fixedSetup: z.boolean(),
  licenseGroup: z.number(),
  hasSupersessions: z.boolean(),
  carSwitching: z.boolean(),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  carClasses: z.array(z.object({
  carClassId: z.number(),
  shortName: z.string(),
  name: z.string(),
  relativeSpeed: z.number()
})),
  raceWeeks: z.array(z.object({
  seasonId: z.number(),
  raceWeekNum: z.number(),
  track: z.object({
  configName: z.string(),
  trackId: z.number(),
  trackName: z.string()
})
}))
}))
}));

// ---- Parameter Schemas ----

const SeriesAssetsParamsSchema = z.object({
});

const SeriesGetParamsSchema = z.object({
});

const SeriesPastSeasonsParamsSchema = z.object({
  seriesId: z.number(), // maps to: series_id
});

const SeriesSeasonsParamsSchema = z.object({
  includeSeries: z.optional(z.boolean()), // maps to: include_series
  seasonYear: z.optional(z.number()), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned. // maps to: season_year
  seasonQuarter: z.optional(z.number()), // To look up past seasons use both a season_year and season_quarter.  Without both, the active seasons are returned. // maps to: season_quarter
});

const SeriesSeasonListParamsSchema = z.object({
  includeSeries: z.optional(z.boolean()), // maps to: include_series
  seasonYear: z.optional(z.number()), // maps to: season_year
  seasonQuarter: z.optional(z.number()), // maps to: season_quarter
});

const SeriesSeasonScheduleParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
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
  SeriesAssetsSchema,
  SeriesGetSchema,
  SeriesSeasonsSchema,
  SeriesSeasonListSchema,
  SeriesStatsSeriesSchema,
};