import * as z from "zod/mini";

// ---- Response Types ----

export interface HostedCombinedSessionsResponse {
  subscribed: boolean;
  sequence: number;
  sessions: any[];
  success: boolean;
}

export interface HostedSessionsResponse {
  subscribed: boolean;
  sessions: any[];
  success: boolean;
}

// ---- Response Schemas ----

const HostedCombinedSessionsSchema = z.object({
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
  sessionDesc: z.string(),
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
  leagueSeasonId: z.number(),
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
  allowedLeagues: z.array(z.unknown()),
  cars: z.array(z.object({
  carId: z.number(),
  carName: z.string(),
  carClassId: z.number(),
  carClassName: z.string(),
  maxPctFuelFill: z.number(),
  weightPenaltyKg: z.number(),
  powerAdjustPct: z.number(),
  maxDryTireSets: z.number(),
  packageId: z.number()
})),
  countByCarId: z.object({
  132: z.number(),
  133: z.number(),
  156: z.number(),
  169: z.number(),
  173: z.number(),
  176: z.number(),
  184: z.number(),
  185: z.number(),
  188: z.number(),
  194: z.number()
}),
  countByCarClassId: z.object({
  2708: z.number()
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
  sessAdmin: z.boolean(),
  friends: z.array(z.unknown()),
  watched: z.array(z.unknown()),
  endTime: z.string(),
  teamEntryCount: z.number(),
  isHeatRacing: z.boolean(),
  populated: z.boolean(),
  broadcaster: z.boolean(),
  minIr: z.number(),
  maxIr: z.number()
})),
  success: z.boolean()
});

const HostedSessionsSchema = z.object({
  subscribed: z.boolean(),
  sessions: z.array(z.object({
  adaptiveAiEnabled: z.boolean(),
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
  aiAvoidPlayers: z.boolean(),
  aiMaxSkill: z.number(),
  aiMinSkill: z.number(),
  aiRosterName: z.string(),
  allowedLeagues: z.array(z.unknown()),
  allowedTeams: z.array(z.unknown()),
  carTypes: z.array(z.object({
  carType: z.string()
})),
  cars: z.array(z.object({
  carId: z.number(),
  carName: z.string(),
  carClassId: z.number(),
  carClassName: z.string(),
  maxPctFuelFill: z.number(),
  weightPenaltyKg: z.number(),
  powerAdjustPct: z.number(),
  maxDryTireSets: z.number(),
  packageId: z.number()
})),
  carsLeft: z.number(),
  category: z.string(),
  categoryId: z.number(),
  connectionBlackFlag: z.boolean(),
  consecCautionWithinNlaps: z.number(),
  consecCautionsSingleFile: z.boolean(),
  countByCarClassId: z.object({
  0: z.number()
}),
  countByCarId: z.object({
  132: z.number(),
  133: z.number(),
  156: z.number(),
  169: z.number(),
  173: z.number(),
  176: z.number(),
  184: z.number(),
  185: z.number(),
  188: z.number(),
  194: z.number()
}),
  damageModel: z.number(),
  disallowVirtualMirror: z.boolean(),
  doNotCountCautionLaps: z.boolean(),
  doNotPaintCars: z.boolean(),
  driverChangeRule: z.number(),
  driverChanges: z.boolean(),
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
  enablePitlaneCollisions: z.boolean(),
  entryCount: z.number(),
  eventTypes: z.array(z.object({
  eventType: z.number()
})),
  farm: z.object({
  farmId: z.number(),
  displayName: z.string(),
  imagePath: z.string(),
  displayed: z.boolean()
}),
  fixedSetup: z.boolean(),
  fullCourseCautions: z.boolean(),
  greenWhiteCheckeredLimit: z.number(),
  hardcoreLevel: z.number(),
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
  incidentLimit: z.number(),
  incidentWarnMode: z.number(),
  incidentWarnParam1: z.number(),
  incidentWarnParam2: z.number(),
  launchAt: z.string(),
  leagueId: z.number(),
  leagueSeasonId: z.number(),
  licenseGroupTypes: z.array(z.object({
  licenseGroupType: z.number()
})),
  loneQualify: z.boolean(),
  luckyDog: z.boolean(),
  maxAiDrivers: z.number(),
  maxDrivers: z.number(),
  maxIr: z.number(),
  maxLicenseLevel: z.number(),
  maxTeamDrivers: z.number(),
  maxVisorTearoffs: z.number(),
  minIr: z.number(),
  minLicenseLevel: z.number(),
  minTeamDrivers: z.number(),
  multiclassType: z.number(),
  mustUseDiffTireTypesInRace: z.boolean(),
  noLapperWaveArounds: z.boolean(),
  numFastTows: z.number(),
  numOptLaps: z.number(),
  openRegExpires: z.string(),
  orderId: z.number(),
  paceCarClassId: z.number(),
  paceCarId: z.number(),
  passwordProtected: z.boolean(),
  pitsInUse: z.number(),
  practiceLength: z.number(),
  privateSessionId: z.number(),
  qualifierMustStartRace: z.boolean(),
  qualifyLaps: z.number(),
  qualifyLength: z.number(),
  raceLaps: z.number(),
  raceLength: z.number(),
  restarts: z.number(),
  restrictResults: z.boolean(),
  restrictViewing: z.boolean(),
  rollingStarts: z.boolean(),
  sessionFull: z.boolean(),
  sessionId: z.number(),
  sessionName: z.string(),
  sessionType: z.number(),
  sessionTypes: z.array(z.object({
  sessionType: z.number()
})),
  shortParadeLap: z.boolean(),
  startOnQualTire: z.boolean(),
  startZone: z.boolean(),
  status: z.number(),
  subsessionId: z.number(),
  teamEntryCount: z.number(),
  telemetryForceToDisk: z.number(),
  telemetryRestriction: z.number(),
  timeLimit: z.number(),
  track: z.object({
  categoryId: z.number(),
  configName: z.string(),
  trackId: z.number(),
  trackName: z.string()
}),
  trackState: z.object({
  leaveMarbles: z.boolean(),
  practiceRubber: z.number(),
  qualifyRubber: z.number(),
  raceRubber: z.number(),
  warmupRubber: z.number()
}),
  trackTypes: z.array(z.object({
  trackType: z.string()
})),
  unsportConductRuleMode: z.number(),
  warmupLength: z.number(),
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
})
})),
  success: z.boolean()
});

// ---- Parameter Schemas ----

const HostedCombinedSessionsParamsSchema = z.object({
  packageId: z.optional(z.number()), // If set, return only sessions using this car or track package ID. // maps to: package_id
});

const HostedSessionsParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type HostedCombinedSessionsParams = z.infer<typeof HostedCombinedSessionsParamsSchema>;
export type HostedSessionsParams = z.infer<typeof HostedSessionsParamsSchema>;

// ---- Exported Schemas ----

export {
  HostedCombinedSessionsParamsSchema,
  HostedSessionsParamsSchema,
  HostedCombinedSessionsSchema,
  HostedSessionsSchema,
};