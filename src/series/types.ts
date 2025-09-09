import * as z from "zod/mini";

// ---- Response Schemas ----

const SeriesAssets = z.record(z.string(), z.object({
  largeImage: z.optional(z.union([z.string(), z.null()])),
  logo: z.optional(z.union([z.string(), z.null()])),
  seriesCopy: z.string(),
  seriesId: z.number(),
  smallImage: z.optional(z.union([z.string(), z.null()]))
}));
const SeriesGet = z.array(z.object({
  allowedLicenses: z.array(z.object({
    groupName: z.optional(z.union([z.string(), z.null()])),
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
  forumUrl: z.optional(z.union([z.string(), z.null()])),
  maxStarters: z.number(),
  minStarters: z.number(),
  ovalCautionType: z.number(),
  roadCautionType: z.number(),
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string()
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
    logo: z.optional(z.union([z.string(), z.null()])),
    licenseGroup: z.number(),
    licenseGroupTypes: z.array(z.object({
      licenseGroupType: z.number()
    })),
    allowedLicenses: z.array(z.object({
      groupName: z.optional(z.union([z.string(), z.null()])),
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
          trackName: z.string()
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
  allowedSeasonMembers: z.optional(z.union([z.string(), z.null()])),
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
  nextRaceSession: z.optional(z.union([z.string(), z.null()])),
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
    raceTimeLimit: z.optional(z.union([z.string(), z.null()])),
    raceWeekCarClassIds: z.array(z.unknown()),
    raceWeekCars: z.array(z.unknown()),
    restartType: z.string(),
    scheduleName: z.string(),
    seasonName: z.string(),
    seriesId: z.number(),
    seriesName: z.string(),
    shortParadeLap: z.boolean(),
    specialEventType: z.optional(z.union([z.string(), z.null()])),
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
const SeriesSeasonList = z.object({
  seasons: z.array(z.object({
    seasonId: z.number(),
    seasonName: z.string(),
    active: z.boolean(),
    allowedSeasonMembers: z.optional(z.union([z.string(), z.null()])),
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
      raceTimeLimit: z.optional(z.union([z.string(), z.null()])),
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
const SeriesStatsSeries = z.array(z.object({
  seriesId: z.number(),
  seriesName: z.string(),
  seriesShortName: z.string(),
  categoryId: z.number(),
  category: z.string(),
  active: z.boolean(),
  official: z.boolean(),
  fixedSetup: z.boolean(),
  logo: z.optional(z.union([z.string(), z.null()])),
  licenseGroup: z.number(),
  licenseGroupTypes: z.array(z.object({
    licenseGroupType: z.number()
  })),
  allowedLicenses: z.array(z.object({
    groupName: z.optional(z.union([z.string(), z.null()])),
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