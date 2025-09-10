import * as z from "zod/mini";

// ---- Response Schemas ----

const SeriesAssets = z.record(z.string(), z.object({
  largeImage: z.optional(z.nullable(z.string())),
  logo: z.optional(z.nullable(z.string())),
  seriesCopy: z.optional(z.nullable(z.string())),
  seriesId: z.optional(z.nullable(z.number())),
  smallImage: z.optional(z.nullable(z.string()))
}));
const SeriesGet = z.array(z.object({
  allowedLicenses: z.array(z.object({
    groupName: z.string(),
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
  forumUrl: z.optional(z.string()),
  maxStarters: z.number(),
  minStarters: z.number(),
  ovalCautionType: z.number(),
  roadCautionType: z.number(),
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string(),
  searchFilters: z.optional(z.string())
}));
const SeriesPastSeasons = z.object({
  success: z.boolean(),
  series: z.object({
    seriesId: z.number(),
    seriesName: z.string(),
    seriesShortName: z.string(),
    categoryId: z.number(),
    category: z.string(),
    active: z.boolean(),
    official: z.boolean(),
    fixedSetup: z.boolean(),
    searchFilters: z.string(),
    logo: z.string(),
    licenseGroup: z.number(),
    licenseGroupTypes: z.array(z.object({
      licenseGroupType: z.number()
    })),
    allowedLicenses: z.array(z.object({
      groupName: z.string(),
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
          trackId: z.number(),
          trackName: z.string(),
          configName: z.optional(z.string())
        })
      }))
    }))
  }),
  seriesId: z.number()
});
const SeriesSeasons = z.array(z.object({
  seasonId: z.number(),
  seasonName: z.string(),
  active: z.boolean(),
  allowedSeasonMembers: z.nullable(z.string()),
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
  nextRaceSession: z.nullable(z.string()),
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
      weightPenaltyKg: z.number(),
      raceSetupId: z.optional(z.number()),
      qualSetupId: z.optional(z.number())
    })),
    category: z.string(),
    categoryId: z.number(),
    enablePitlaneCollisions: z.boolean(),
    fullCourseCautions: z.boolean(),
    practiceLength: z.optional(z.number()),
    qualAttached: z.boolean(),
    qualifyLaps: z.optional(z.number()),
    qualifyLength: z.optional(z.number()),
    raceLapLimit: z.nullable(z.number()),
    raceTimeDescriptors: z.array(z.object({
      dayOffset: z.optional(z.array(z.number())),
      firstSessionTime: z.optional(z.string()),
      repeatMinutes: z.optional(z.number()),
      repeating: z.boolean(),
      sessionMinutes: z.number(),
      startDate: z.optional(z.string()),
      superSession: z.boolean(),
      sessionTimes: z.optional(z.array(z.string()))
    })),
    raceTimeLimit: z.nullable(z.number()),
    raceWeekCarClassIds: z.array(z.unknown()),
    raceWeekCars: z.array(z.unknown()),
    restartType: z.string(),
    scheduleName: z.string(),
    seasonName: z.string(),
    seriesId: z.number(),
    seriesName: z.string(),
    shortParadeLap: z.boolean(),
    specialEventType: z.nullable(z.string()),
    startDate: z.string(),
    startType: z.string(),
    startZone: z.boolean(),
    track: z.object({
      category: z.string(),
      categoryId: z.number(),
      configName: z.optional(z.string()),
      trackId: z.number(),
      trackName: z.string()
    }),
    trackState: z.object({
      leaveMarbles: z.boolean(),
      practiceRubber: z.optional(z.number()),
      raceRubber: z.optional(z.number())
    }),
    warmupLength: z.optional(z.number()),
    weather: z.object({
      allowFog: z.boolean(),
      forecastOptions: z.object({
        allowFog: z.boolean(),
        forecastType: z.number(),
        precipitation: z.number(),
        skies: z.number(),
        stopPrecip: z.number(),
        temperature: z.number(),
        weatherSeed: z.optional(z.number()),
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
  unsportConductRuleMode: z.number(),
  heatSesInfo: z.optional(z.object({
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
})),
  regOpenMinutes: z.optional(z.number())
}));
const SeriesSeasonList = z.object({
  seasons: z.array(z.object({
    seasonId: z.number(),
    seasonName: z.string(),
    active: z.boolean(),
    allowedSeasonMembers: z.nullable(z.string()),
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
        configName: z.optional(z.string()),
        trackId: z.number(),
        trackName: z.string()
      }),
      carRestrictions: z.array(z.object({
        carId: z.number(),
        maxDryTireSets: z.number(),
        maxPctFuelFill: z.number(),
        powerAdjustPct: z.number(),
        weightPenaltyKg: z.number(),
        raceSetupId: z.optional(z.number()),
        qualSetupId: z.optional(z.number())
      })),
      raceLapLimit: z.nullable(z.number()),
      raceTimeLimit: z.nullable(z.number()),
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
    unsportConductRuleMode: z.number(),
    heatSesInfo: z.optional(z.object({
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
    })),
    regOpenMinutes: z.optional(z.number())
  }))
});
const SeriesStatsSeries = z.array(z.object({
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string(),
  categoryId: z.number(),
  category: z.string(),
  active: z.boolean(),
  official: z.boolean(),
  fixedSetup: z.boolean(),
  logo: z.nullable(z.string()),
  licenseGroup: z.number(),
  licenseGroupTypes: z.array(z.object({
    licenseGroupType: z.number()
  })),
  allowedLicenses: z.array(z.object({
    groupName: z.string(),
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
        configName: z.optional(z.string()),
        trackId: z.number(),
        trackName: z.string()
      })
    }))
  })),
  searchFilters: z.optional(z.string())
}));

// ---- Response Types (inferred from schemas) ----

export type SeriesAssetsResponse = z.infer<typeof SeriesAssets>;
export type SeriesGetResponse = z.infer<typeof SeriesGet>;
export type SeriesPastSeasonsResponse = z.infer<typeof SeriesPastSeasons>;
export type SeriesSeasonsResponse = z.infer<typeof SeriesSeasons>;
export type SeriesSeasonListResponse = z.infer<typeof SeriesSeasonList>;
export type SeriesStatsSeriesResponse = z.infer<typeof SeriesStatsSeries>;

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
  SeriesAssets,
  SeriesGet,
  SeriesPastSeasons,
  SeriesSeasons,
  SeriesSeasonList,
  SeriesStatsSeries,
};