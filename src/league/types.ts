import * as z from "zod/mini";

// ---- Response Types ----

export interface LeagueCustLeagueSessionsResponse {
  mine: boolean;
  subscribed: boolean;
  sequence: number;
  sessions: any[];
  success: boolean;
}

export interface LeagueDirectoryResponse {
  resultsPage: any[]; // maps from: results_page
  success: boolean;
  lowerbound: number;
  upperbound: number;
  rowCount: number; // maps from: row_count
}

export interface LeagueGetResponse {
  leagueId: number; // maps from: league_id
  ownerId: number; // maps from: owner_id
  leagueName: string; // maps from: league_name
  created: string;
  hidden: boolean;
  message: string;
  about: string;
  recruiting: boolean;
  privateWall: boolean; // maps from: private_wall
  privateRoster: boolean; // maps from: private_roster
  privateSchedule: boolean; // maps from: private_schedule
  privateResults: boolean; // maps from: private_results
  isOwner: boolean; // maps from: is_owner
  isAdmin: boolean; // maps from: is_admin
  rosterCount: number; // maps from: roster_count
  owner: any;
  image: any;
  tags: any;
  leagueApplications: any[]; // maps from: league_applications
  pendingRequests: any[]; // maps from: pending_requests
  isMember: boolean; // maps from: is_member
  isApplicant: boolean; // maps from: is_applicant
  isInvite: boolean; // maps from: is_invite
  isIgnored: boolean; // maps from: is_ignored
  roster: any[];
}

export interface LeagueGetPointsSystemsResponse {
  subscribed: boolean;
  success: boolean;
  pointsSystems: any[]; // maps from: points_systems
  leagueId: number; // maps from: league_id
}

export interface LeagueMembershipItem {
  leagueId: number; // maps from: league_id
  leagueName: string; // maps from: league_name
  owner: boolean;
  admin: boolean;
  leagueMailOptOut: boolean; // maps from: league_mail_opt_out
  leaguePmOptOut: boolean; // maps from: league_pm_opt_out
  carNumber: string; // maps from: car_number
  nickName: string; // maps from: nick_name
}

export type LeagueMembershipResponse = LeagueMembershipItem[];

export interface LeagueRosterResponse {
  type: string;
  data: any;
  dataUrl: string; // maps from: data_url
}

export interface LeagueSeasonsResponse {
  subscribed: boolean;
  seasons: any[];
  success: boolean;
  retired: boolean;
  leagueId: number; // maps from: league_id
}

export interface LeagueSeasonStandingsResponse {
  carClassId: number; // maps from: car_class_id
  success: boolean;
  seasonId: number; // maps from: season_id
  carId: number; // maps from: car_id
  standings: any;
  leagueId: number; // maps from: league_id
}

export interface LeagueSeasonSessionsResponse {
  success: boolean;
  subscribed: boolean;
  leagueId: number; // maps from: league_id
  seasonId: number; // maps from: season_id
  sessions: any[];
}

// ---- Response Schemas ----

const LeagueCustLeagueSessionsSchema = z.object({
  mine: z.boolean(),
  subscribed: z.boolean(),
  sequence: z.number(),
  sessions: z.array(z.object({
  numDrivers: z.number(),
  numSpotters: z.number(),
  numSpectators: z.number(),
  numBroadcasters: z.number(),
  availableReservedBroadcasterSlots: z.number(),
  numSpectatorSlots: z.number(),
  availableSpectatorSlots: z.number(),
  canBroadcast: z.boolean(),
  canWatch: z.boolean(),
  canSpot: z.boolean(),
  elig: z.object({
  sessionFull: z.boolean(),
  canSpot: z.boolean(),
  canWatch: z.boolean(),
  canDrive: z.boolean(),
  hasSessPassword: z.boolean(),
  needsPurchase: z.boolean(),
  ownCar: z.boolean(),
  ownTrack: z.boolean(),
  purchaseSkus: z.array(z.number()),
  registered: z.boolean()
}),
  driverChanges: z.boolean(),
  restrictViewing: z.boolean(),
  maxUsers: z.number(),
  privateSessionId: z.number(),
  sessionId: z.number(),
  subsessionId: z.number(),
  passwordProtected: z.boolean(),
  sessionName: z.string(),
  openRegExpires: z.string(),
  launchAt: z.string(),
  fullCourseCautions: z.boolean(),
  numFastTows: z.number(),
  rollingStarts: z.boolean(),
  restarts: z.number(),
  multiclassType: z.number(),
  pitsInUse: z.number(),
  carsLeft: z.number(),
  maxDrivers: z.number(),
  hardcoreLevel: z.number(),
  practiceLength: z.number(),
  loneQualify: z.boolean(),
  qualifyLaps: z.number(),
  qualifyLength: z.number(),
  warmupLength: z.number(),
  raceLaps: z.number(),
  raceLength: z.number(),
  timeLimit: z.number(),
  restrictResults: z.boolean(),
  incidentLimit: z.number(),
  incidentWarnMode: z.number(),
  incidentWarnParam1: z.number(),
  incidentWarnParam2: z.number(),
  unsportConductRuleMode: z.number(),
  connectionBlackFlag: z.boolean(),
  luckyDog: z.boolean(),
  minTeamDrivers: z.number(),
  maxTeamDrivers: z.number(),
  qualifierMustStartRace: z.boolean(),
  driverChangeRule: z.number(),
  fixedSetup: z.boolean(),
  entryCount: z.number(),
  leagueId: z.number(),
  leagueName: z.string(),
  leagueSeasonId: z.number(),
  leagueSeasonName: z.string(),
  sessionType: z.number(),
  orderId: z.number(),
  minLicenseLevel: z.number(),
  maxLicenseLevel: z.number(),
  status: z.number(),
  paceCarId: z.optional(z.union([z.string(), z.null()])),
  paceCarClassId: z.optional(z.union([z.string(), z.null()])),
  numOptLaps: z.number(),
  damageModel: z.number(),
  doNotPaintCars: z.boolean(),
  greenWhiteCheckeredLimit: z.number(),
  doNotCountCautionLaps: z.boolean(),
  consecCautionsSingleFile: z.boolean(),
  consecCautionWithinNlaps: z.number(),
  noLapperWaveArounds: z.boolean(),
  shortParadeLap: z.boolean(),
  startOnQualTire: z.boolean(),
  telemetryRestriction: z.number(),
  telemetryForceToDisk: z.number(),
  maxAiDrivers: z.number(),
  aiAvoidPlayers: z.boolean(),
  adaptiveAiEnabled: z.boolean(),
  adaptiveAiDifficulty: z.number(),
  mustUseDiffTireTypesInRace: z.boolean(),
  startZone: z.boolean(),
  enablePitlaneCollisions: z.boolean(),
  disallowVirtualMirror: z.boolean(),
  maxVisorTearoffs: z.number(),
  categoryId: z.number(),
  category: z.string(),
  sessionFull: z.boolean(),
  host: z.object({
  custId: z.number(),
  displayName: z.string(),
  helmet: z.object({
  pattern: z.number(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string(),
  faceType: z.number(),
  helmetType: z.number()
})
}),
  track: z.object({
  categoryId: z.number(),
  configName: z.string(),
  trackId: z.number(),
  trackName: z.string()
}),
  weather: z.object({
  allowFog: z.boolean(),
  forecastOptions: z.object({
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
  trackState: z.object({
  leaveMarbles: z.boolean(),
  practiceRubber: z.number(),
  qualifyRubber: z.number(),
  raceRubber: z.number(),
  warmupRubber: z.number()
}),
  farm: z.object({
  farmId: z.number(),
  displayName: z.string(),
  imagePath: z.string(),
  displayed: z.boolean()
}),
  admins: z.array(z.object({
  custId: z.number(),
  displayName: z.string(),
  helmet: z.object({
  pattern: z.number(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string(),
  faceType: z.number(),
  helmetType: z.number()
})
})),
  allowedTeams: z.array(z.unknown()),
  allowedLeagues: z.array(z.number()),
  cars: z.array(z.object({
  carId: z.number(),
  carName: z.string(),
  carClassId: z.number(),
  carClassName: z.string(),
  maxPctFuelFill: z.number(),
  weightPenaltyKg: z.number(),
  powerAdjustPct: z.number(),
  maxDryTireSets: z.number(),
  qualSetupId: z.number(),
  qualSetupFilename: z.string(),
  raceSetupId: z.number(),
  raceSetupFilename: z.string(),
  packageId: z.number()
})),
  heatSesInfo: z.object({
  consolationDeltaMaxFieldSize: z.number(),
  consolationDeltaSessionLaps: z.number(),
  consolationDeltaSessionLengthMinutes: z.number(),
  consolationFirstMaxFieldSize: z.number(),
  consolationFirstSessionLaps: z.number(),
  consolationFirstSessionLengthMinutes: z.number(),
  consolationNumPositionToInvert: z.number(),
  consolationNumToConsolation: z.number(),
  consolationNumToMain: z.number(),
  consolationRunAlways: z.boolean(),
  consolationScoresChampPoints: z.boolean(),
  created: z.string(),
  custId: z.number(),
  description: z.string(),
  heatCautionType: z.number(),
  heatInfoId: z.number(),
  heatInfoName: z.string(),
  heatLaps: z.number(),
  heatLengthMinutes: z.number(),
  heatMaxFieldSize: z.number(),
  heatNumFromEachToMain: z.number(),
  heatNumPositionToInvert: z.number(),
  heatScoresChampPoints: z.boolean(),
  heatSessionMinutesEstimate: z.number(),
  hidden: z.boolean(),
  mainLaps: z.number(),
  mainLengthMinutes: z.number(),
  mainMaxFieldSize: z.number(),
  mainNumPositionToInvert: z.number(),
  maxEntrants: z.number(),
  openPractice: z.boolean(),
  preMainPracticeLengthMinutes: z.number(),
  preQualNumToMain: z.number(),
  preQualPracticeLengthMinutes: z.number(),
  qualCautionType: z.number(),
  qualLaps: z.number(),
  qualLengthMinutes: z.number(),
  qualNumToMain: z.number(),
  qualOpenDelaySeconds: z.number(),
  qualScoresChampPoints: z.boolean(),
  qualScoring: z.number(),
  qualStyle: z.number(),
  raceStyle: z.number()
}),
  countByCarId: z.object({
  203: z.number()
}),
  countByCarClassId: z.object({
  0: z.number()
}),
  carTypes: z.array(z.object({
  carType: z.string()
})),
  trackTypes: z.array(z.object({
  trackType: z.string()
})),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  eventTypes: z.array(z.object({
  eventType: z.number()
})),
  sessionTypes: z.array(z.object({
  sessionType: z.number()
})),
  canJoin: z.boolean(),
  image: z.object({
  smallLogo: z.string(),
  largeLogo: z.string()
}),
  owner: z.boolean(),
  admin: z.boolean(),
  friends: z.array(z.unknown()),
  watched: z.array(z.unknown()),
  endTime: z.string(),
  populated: z.boolean(),
  teamEntryCount: z.number(),
  isHeatRacing: z.boolean(),
  broadcaster: z.boolean(),
  minIr: z.number(),
  maxIr: z.number()
})),
  success: z.boolean()
});

const LeagueDirectorySchema = z.object({
  resultsPage: z.array(z.object({
  leagueId: z.number(),
  ownerId: z.number(),
  leagueName: z.string(),
  created: z.string(),
  about: z.string(),
  url: z.string(),
  rosterCount: z.number(),
  recruiting: z.boolean(),
  isAdmin: z.boolean(),
  isMember: z.boolean(),
  pendingApplication: z.boolean(),
  pendingInvitation: z.boolean(),
  owner: z.object({
  custId: z.number(),
  displayName: z.string(),
  helmet: z.object({
  pattern: z.number(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string(),
  faceType: z.number(),
  helmetType: z.number()
}),
  carNumber: z.optional(z.union([z.string(), z.null()])),
  nickName: z.optional(z.union([z.string(), z.null()]))
})
})),
  success: z.boolean(),
  lowerbound: z.number(),
  upperbound: z.number(),
  rowCount: z.number()
});

const LeagueGetSchema = z.object({
  leagueId: z.number(),
  ownerId: z.number(),
  leagueName: z.string(),
  created: z.string(),
  hidden: z.boolean(),
  message: z.string(),
  about: z.string(),
  recruiting: z.boolean(),
  privateWall: z.boolean(),
  privateRoster: z.boolean(),
  privateSchedule: z.boolean(),
  privateResults: z.boolean(),
  isOwner: z.boolean(),
  isAdmin: z.boolean(),
  rosterCount: z.number(),
  owner: z.object({
  custId: z.number(),
  displayName: z.string(),
  helmet: z.object({
  pattern: z.number(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string(),
  faceType: z.number(),
  helmetType: z.number()
}),
  carNumber: z.optional(z.union([z.string(), z.null()])),
  nickName: z.optional(z.union([z.string(), z.null()]))
}),
  image: z.object({
  smallLogo: z.optional(z.union([z.string(), z.null()])),
  largeLogo: z.optional(z.union([z.string(), z.null()]))
}),
  tags: z.object({
  categorized: z.array(z.object({
  categoryId: z.number(),
  name: z.string(),
  limit: z.optional(z.union([z.string(), z.null()])),
  tags: z.array(z.object({
  tagId: z.number(),
  tagName: z.string()
}))
})),
  notCategorized: z.array(z.unknown())
}),
  leagueApplications: z.array(z.unknown()),
  pendingRequests: z.array(z.unknown()),
  isMember: z.boolean(),
  isApplicant: z.boolean(),
  isInvite: z.boolean(),
  isIgnored: z.boolean(),
  roster: z.array(z.object({
  custId: z.number(),
  displayName: z.string(),
  helmet: z.object({
  pattern: z.number(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string(),
  faceType: z.number(),
  helmetType: z.number()
}),
  owner: z.boolean(),
  admin: z.boolean(),
  leagueMailOptOut: z.boolean(),
  leaguePmOptOut: z.boolean(),
  leagueMemberSince: z.string(),
  carNumber: z.string(),
  nickName: z.string()
}))
});

const LeagueGetPointsSystemsSchema = z.object({
  subscribed: z.boolean(),
  success: z.boolean(),
  pointsSystems: z.array(z.object({
  pointsSystemId: z.number(),
  name: z.string(),
  description: z.string(),
  leagueId: z.number(),
  retired: z.boolean(),
  iracingSystem: z.boolean()
})),
  leagueId: z.number()
});

const LeagueMembershipSchema = z.array(z.object({
  leagueId: z.number(),
  leagueName: z.string(),
  owner: z.boolean(),
  admin: z.boolean(),
  leagueMailOptOut: z.boolean(),
  leaguePmOptOut: z.boolean(),
  carNumber: z.string(),
  nickName: z.string()
}));

const LeagueRosterSchema = z.object({
  type: z.string(),
  data: z.object({
  subscribed: z.boolean(),
  success: z.boolean(),
  rosterCount: z.number(),
  leagueId: z.number()
}),
  dataUrl: z.string()
});

const LeagueSeasonsSchema = z.object({
  subscribed: z.boolean(),
  seasons: z.array(z.unknown()),
  success: z.boolean(),
  retired: z.boolean(),
  leagueId: z.number()
});

const LeagueSeasonStandingsSchema = z.object({
  carClassId: z.number(),
  success: z.boolean(),
  seasonId: z.number(),
  carId: z.number(),
  standings: z.object({
  driverStandings: z.array(z.unknown()),
  teamStandings: z.array(z.unknown()),
  driverStandingsCsvUrl: z.string(),
  teamStandingsCsvUrl: z.string()
}),
  leagueId: z.number()
});

const LeagueSeasonSessionsSchema = z.object({
  success: z.boolean(),
  subscribed: z.boolean(),
  leagueId: z.number(),
  seasonId: z.number(),
  sessions: z.array(z.unknown())
});

// ---- Parameter Schemas ----

const LeagueCustLeagueSessionsParamsSchema = z.object({
  mine: z.optional(z.boolean()), // If true, return only sessions created by this user.
  packageId: z.optional(z.number()), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

const LeagueDirectoryParamsSchema = z.object({
  search: z.optional(z.string()), // Will search against league name, description, owner, and league ID.
  tag: z.optional(z.string()), // One or more tags, comma-separated.
  restrictToMember: z.optional(z.boolean()), // If true include only leagues for which customer is a member. // maps to: restrict_to_member
  restrictToRecruiting: z.optional(z.boolean()), // If true include only leagues which are recruiting. // maps to: restrict_to_recruiting
  restrictToFriends: z.optional(z.boolean()), // If true include only leagues owned by a friend. // maps to: restrict_to_friends
  restrictToWatched: z.optional(z.boolean()), // If true include only leagues owned by a watched member. // maps to: restrict_to_watched
  minimumRosterCount: z.optional(z.number()), // If set include leagues with at least this number of members. // maps to: minimum_roster_count
  maximumRosterCount: z.optional(z.number()), // If set include leagues with no more than this number of members. // maps to: maximum_roster_count
  lowerbound: z.optional(z.number()), // First row of results to return.  Defaults to 1.
  upperbound: z.optional(z.number()), // Last row of results to return. Defaults to lowerbound + 39.
  sort: z.optional(z.string()), // One of relevance, leaguename, displayname, rostercount. displayname is owners's name. Defaults to relevance.
  order: z.optional(z.string()), // One of asc or desc.  Defaults to asc.
});

const LeagueGetParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
});

const LeagueGetPointsSystemsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.optional(z.number()), // If included and the season is using custom points (points_system_id:2) then the custom points option is included in the returned list. Otherwise the custom points option is not returned. // maps to: season_id
});

const LeagueMembershipParamsSchema = z.object({
  custId: z.optional(z.number()), // If different from the authenticated member, the following restrictions apply: - Caller cannot be on requested customer's block list or an empty list will result; - Requested customer cannot have their online activity preference set to hidden or an empty list will result; - Only leagues for which the requested customer is an admin and the league roster is not private are returned. // maps to: cust_id
  includeLeague: z.optional(z.boolean()), // maps to: include_league
});

const LeagueRosterParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  includeLicenses: z.optional(z.boolean()), // For faster responses, only request when necessary. // maps to: include_licenses
});

const LeagueSeasonsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  retired: z.optional(z.boolean()), // If true include seasons which are no longer active.
});

const LeagueSeasonStandingsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  carClassId: z.optional(z.number()), // maps to: car_class_id
  carId: z.optional(z.number()), // If car_class_id is included then the standings are for the car in that car class, otherwise they are for the car across car classes. // maps to: car_id
});

const LeagueSeasonSessionsParamsSchema = z.object({
  leagueId: z.number(), // maps to: league_id
  seasonId: z.number(), // maps to: season_id
  resultsOnly: z.optional(z.boolean()), // If true include only sessions for which results are available. // maps to: results_only
});

// ---- Exported Parameter Types ----

export type LeagueCustLeagueSessionsParams = z.infer<typeof LeagueCustLeagueSessionsParamsSchema>;
export type LeagueDirectoryParams = z.infer<typeof LeagueDirectoryParamsSchema>;
export type LeagueGetParams = z.infer<typeof LeagueGetParamsSchema>;
export type LeagueGetPointsSystemsParams = z.infer<typeof LeagueGetPointsSystemsParamsSchema>;
export type LeagueMembershipParams = z.infer<typeof LeagueMembershipParamsSchema>;
export type LeagueRosterParams = z.infer<typeof LeagueRosterParamsSchema>;
export type LeagueSeasonsParams = z.infer<typeof LeagueSeasonsParamsSchema>;
export type LeagueSeasonStandingsParams = z.infer<typeof LeagueSeasonStandingsParamsSchema>;
export type LeagueSeasonSessionsParams = z.infer<typeof LeagueSeasonSessionsParamsSchema>;

// ---- Exported Schemas ----

export {
  LeagueCustLeagueSessionsParamsSchema,
  LeagueDirectoryParamsSchema,
  LeagueGetParamsSchema,
  LeagueGetPointsSystemsParamsSchema,
  LeagueMembershipParamsSchema,
  LeagueRosterParamsSchema,
  LeagueSeasonsParamsSchema,
  LeagueSeasonStandingsParamsSchema,
  LeagueSeasonSessionsParamsSchema,
  LeagueCustLeagueSessionsSchema,
  LeagueDirectorySchema,
  LeagueGetSchema,
  LeagueGetPointsSystemsSchema,
  LeagueMembershipSchema,
  LeagueRosterSchema,
  LeagueSeasonsSchema,
  LeagueSeasonStandingsSchema,
  LeagueSeasonSessionsSchema,
};