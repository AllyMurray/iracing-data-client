import * as z from "zod/mini";

// ---- Response Schemas ----

const ResultsGet = z.object({
  subsessionId: z.number(),
  allowedLicenses: z.array(z.object({
    groupName: z.string(),
    licenseGroup: z.number(),
    maxLicenseLevel: z.number(),
    minLicenseLevel: z.number(),
    parentId: z.number()
  })),
  associatedSubsessionIds: z.array(z.number()),
  canProtest: z.boolean(),
  carClasses: z.array(z.object({
    carClassId: z.number(),
    shortName: z.string(),
    name: z.string(),
    strengthOfField: z.number(),
    numEntries: z.number(),
    carsInClass: z.array(z.object({
      carId: z.number()
    }))
  })),
  cautionType: z.number(),
  cooldownMinutes: z.number(),
  cornersPerLap: z.number(),
  damageModel: z.number(),
  driverChangeParam1: z.number(),
  driverChangeParam2: z.number(),
  driverChangeRule: z.number(),
  driverChanges: z.boolean(),
  endTime: z.string(),
  eventAverageLap: z.number(),
  eventBestLapTime: z.number(),
  eventLapsComplete: z.number(),
  eventStrengthOfField: z.number(),
  eventType: z.number(),
  eventTypeName: z.string(),
  heatInfoId: z.number(),
  licenseCategory: z.string(),
  licenseCategoryId: z.number(),
  limitMinutes: z.number(),
  maxTeamDrivers: z.number(),
  maxWeeks: z.number(),
  minTeamDrivers: z.number(),
  numCautionLaps: z.number(),
  numCautions: z.number(),
  numDrivers: z.number(),
  numLapsForQualAverage: z.number(),
  numLapsForSoloAverage: z.number(),
  numLeadChanges: z.number(),
  officialSession: z.boolean(),
  pointsType: z.string(),
  privateSessionId: z.number(),
  raceWeekNum: z.number(),
  resultsRestricted: z.boolean(),
  seasonId: z.number(),
  seasonName: z.string(),
  seasonQuarter: z.number(),
  seasonShortName: z.string(),
  seasonYear: z.number(),
  seriesId: z.number(),
  seriesLogo: z.string(),
  seriesName: z.string(),
  seriesShortName: z.string(),
  sessionId: z.number(),
  sessionResults: z.array(z.object({
    simsessionNumber: z.number(),
    simsessionName: z.string(),
    simsessionType: z.number(),
    simsessionTypeName: z.string(),
    simsessionSubtype: z.number(),
    results: z.array(z.object({
      custId: z.number(),
      displayName: z.string(),
      aggregateChampPoints: z.number(),
      ai: z.boolean(),
      averageLap: z.number(),
      bestLapNum: z.number(),
      bestLapTime: z.number(),
      bestNlapsNum: z.number(),
      bestNlapsTime: z.number(),
      bestQualLapAt: z.string(),
      bestQualLapNum: z.number(),
      bestQualLapTime: z.number(),
      carClassId: z.number(),
      carClassName: z.string(),
      carClassShortName: z.string(),
      carId: z.number(),
      carName: z.string(),
      carcfg: z.number(),
      champPoints: z.number(),
      classInterval: z.number(),
      countryCode: z.string(),
      division: z.number(),
      divisionName: z.string(),
      dropRace: z.boolean(),
      finishPosition: z.number(),
      finishPositionInClass: z.number(),
      flairId: z.number(),
      flairName: z.string(),
      flairShortname: z.string(),
      friend: z.boolean(),
      helmet: z.object({
        pattern: z.number(),
        color1: z.string(),
        color2: z.string(),
        color3: z.string(),
        faceType: z.number(),
        helmetType: z.number()
      }),
      incidents: z.number(),
      interval: z.number(),
      lapsComplete: z.number(),
      lapsLead: z.number(),
      leagueAggPoints: z.number(),
      leaguePoints: z.number(),
      licenseChangeOval: z.number(),
      licenseChangeRoad: z.number(),
      livery: z.object({
        carId: z.number(),
        pattern: z.number(),
        color1: z.string(),
        color2: z.string(),
        color3: z.string(),
        numberFont: z.number(),
        numberColor1: z.string(),
        numberColor2: z.string(),
        numberColor3: z.string(),
        numberSlant: z.number(),
        sponsor1: z.number(),
        sponsor2: z.number(),
        carNumber: z.string(),
        wheelColor: z.nullable(z.string()),
        rimType: z.number()
      }),
      maxPctFuelFill: z.number(),
      newCpi: z.number(),
      newLicenseLevel: z.number(),
      newSubLevel: z.number(),
      newTtrating: z.number(),
      newiRating: z.number(),
      oldCpi: z.number(),
      oldLicenseLevel: z.number(),
      oldSubLevel: z.number(),
      oldTtrating: z.number(),
      oldiRating: z.number(),
      optLapsComplete: z.number(),
      position: z.number(),
      qualLapTime: z.number(),
      reasonOut: z.string(),
      reasonOutId: z.number(),
      startingPosition: z.number(),
      startingPositionInClass: z.number(),
      suit: z.object({
        pattern: z.number(),
        color1: z.string(),
        color2: z.string(),
        color3: z.string()
      }),
      watched: z.boolean(),
      weightPenaltyKg: z.number()
    }))
  })),
  sessionSplits: z.array(z.object({
    subsessionId: z.number(),
    eventStrengthOfField: z.number()
  })),
  specialEventType: z.number(),
  startTime: z.string(),
  track: z.object({
    category: z.string(),
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
  weather: z.object({
    allowFog: z.boolean(),
    fog: z.number(),
    precipMm2hrBeforeFinalSession: z.number(),
    precipMmFinalSession: z.number(),
    precipOption: z.number(),
    precipTimePct: z.number(),
    relHumidity: z.number(),
    simulatedStartTime: z.string(),
    skies: z.number(),
    tempUnits: z.number(),
    tempValue: z.number(),
    timeOfDay: z.number(),
    trackWater: z.number(),
    type: z.number(),
    version: z.number(),
    weatherVarInitial: z.number(),
    weatherVarOngoing: z.number(),
    windDir: z.number(),
    windUnits: z.number(),
    windValue: z.number()
  })
});
const ResultsEventLog = z.object({
  success: z.boolean(),
  sessionInfo: z.object({
    subsessionId: z.number(),
    sessionId: z.number(),
    simsessionNumber: z.number(),
    simsessionType: z.number(),
    simsessionName: z.string(),
    eventType: z.number(),
    eventTypeName: z.string(),
    privateSessionId: z.number(),
    seasonName: z.string(),
    seasonShortName: z.string(),
    seriesName: z.string(),
    seriesShortName: z.string(),
    startTime: z.string(),
    track: z.object({
      configName: z.string(),
      trackId: z.number(),
      trackName: z.string()
    })
  }),
  chunkInfo: z.object({
    chunkSize: z.number(),
    numChunks: z.number(),
    rows: z.number(),
    baseDownloadUrl: z.nullable(z.string()),
    chunkFileNames: z.array(z.string())
  })
});
const ResultsLapChartData = z.object({
  success: z.boolean(),
  sessionInfo: z.object({
    subsessionId: z.number(),
    sessionId: z.number(),
    simsessionNumber: z.number(),
    simsessionType: z.number(),
    simsessionName: z.string(),
    numLapsForQualAverage: z.number(),
    numLapsForSoloAverage: z.number(),
    eventType: z.number(),
    eventTypeName: z.string(),
    privateSessionId: z.number(),
    seasonName: z.string(),
    seasonShortName: z.string(),
    seriesName: z.string(),
    seriesShortName: z.string(),
    startTime: z.string(),
    track: z.object({
      configName: z.string(),
      trackId: z.number(),
      trackName: z.string()
    })
  }),
  bestLapNum: z.number(),
  bestLapTime: z.number(),
  bestNlapsNum: z.number(),
  bestNlapsTime: z.number(),
  bestQualLapNum: z.number(),
  bestQualLapTime: z.number(),
  bestQualLapAt: z.nullable(z.unknown()),
  chunkInfo: z.object({
    chunkSize: z.number(),
    numChunks: z.number(),
    rows: z.number(),
    baseDownloadUrl: z.string(),
    chunkFileNames: z.array(z.string())
  }),
  lastUpdated: z.string()
});
const ResultsLapData = z.object({
  success: z.boolean(),
  sessionInfo: z.object({
    subsessionId: z.number(),
    sessionId: z.number(),
    simsessionNumber: z.number(),
    simsessionType: z.number(),
    simsessionName: z.string(),
    numLapsForQualAverage: z.number(),
    numLapsForSoloAverage: z.number(),
    eventType: z.number(),
    eventTypeName: z.string(),
    privateSessionId: z.number(),
    seasonName: z.string(),
    seasonShortName: z.string(),
    seriesName: z.string(),
    seriesShortName: z.string(),
    startTime: z.string(),
    track: z.object({
      configName: z.string(),
      trackId: z.number(),
      trackName: z.string()
    })
  }),
  bestLapNum: z.number(),
  bestLapTime: z.number(),
  bestNlapsNum: z.number(),
  bestNlapsTime: z.number(),
  bestQualLapNum: z.number(),
  bestQualLapTime: z.number(),
  bestQualLapAt: z.nullable(z.unknown()),
  chunkInfo: z.object({
    chunkSize: z.number(),
    numChunks: z.number(),
    rows: z.number(),
    baseDownloadUrl: z.string(),
    chunkFileNames: z.array(z.string())
  }),
  lastUpdated: z.string(),
  groupId: z.number(),
  custId: z.number(),
  name: z.string(),
  carId: z.number(),
  licenseLevel: z.number(),
  livery: z.object({
    carId: z.number(),
    pattern: z.number(),
    color1: z.string(),
    color2: z.string(),
    color3: z.string(),
    numberFont: z.number(),
    numberColor1: z.string(),
    numberColor2: z.string(),
    numberColor3: z.string(),
    numberSlant: z.number(),
    sponsor1: z.number(),
    sponsor2: z.number(),
    carNumber: z.string(),
    wheelColor: z.nullable(z.unknown()),
    rimType: z.number()
  })
});
const ResultsSearchHosted = z.object({
  type: z.string(),
  data: z.object({
    success: z.boolean(),
    chunkInfo: z.object({
      chunkSize: z.number(),
      numChunks: z.number(),
      rows: z.number(),
      baseDownloadUrl: z.nullable(z.unknown()),
      chunkFileNames: z.array(z.unknown())
    }),
    params: z.object({
      custId: z.number(),
      teamId: z.number(),
      finishRangeBegin: z.optional(z.string()),
      finishRangeEnd: z.optional(z.string()),
      startRangeBegin: z.string(),
      startRangeEnd: z.optional(z.string()),
      categoryIds: z.array(z.number()),
      hostCustId: z.optional(z.number()),
      sessionName: z.optional(z.string()),
      carId: z.optional(z.number()),
      trackId: z.optional(z.number()),
      leagueId: z.optional(z.number()),
      leagueSeasonId: z.optional(z.number())
    })
  })
});
const ResultsSearchSeries = z.object({
  type: z.string(),
  data: z.object({
    success: z.boolean(),
    chunkInfo: z.object({
      chunkSize: z.number(),
      numChunks: z.number(),
      rows: z.number(),
      baseDownloadUrl: z.nullable(z.unknown()),
      chunkFileNames: z.array(z.unknown())
    }),
    params: z.object({
      custId: z.optional(z.number()),
      teamId: z.optional(z.number()),
      finishRangeBegin: z.optional(z.string()),
      finishRangeEnd: z.optional(z.string()),
      startRangeBegin: z.optional(z.string()),
      startRangeEnd: z.optional(z.string()),
      categoryIds: z.array(z.number()),
      seriesId: z.optional(z.number()),
      seasonYear: z.optional(z.number()),
      seasonQuarter: z.optional(z.number()),
      raceWeekNum: z.number(),
      officialOnly: z.boolean(),
      eventTypes: z.array(z.number()),
      seasonLicenseGroups: z.array(z.number())
    })
  })
});
const ResultsSeasonResults = z.object({
  success: z.boolean(),
  seasonId: z.number(),
  raceWeekNum: z.number(),
  eventType: z.nullable(z.number()),
  resultsList: z.array(z.object({
    sessionId: z.number(),
    subsessionId: z.number(),
    raceWeekNum: z.number(),
    carClasses: z.array(z.object({
      carClassId: z.number(),
      shortName: z.string(),
      name: z.string(),
      numEntries: z.number(),
      strengthOfField: z.number()
    })),
    driverChanges: z.boolean(),
    eventBestLapTime: z.number(),
    eventStrengthOfField: z.number(),
    eventType: z.number(),
    eventTypeName: z.string(),
    farm: z.object({
      farmId: z.number(),
      displayName: z.string(),
      imagePath: z.string(),
      displayed: z.boolean()
    }),
    numCautionLaps: z.number(),
    numCautions: z.number(),
    numDrivers: z.number(),
    numLeadChanges: z.number(),
    officialSession: z.boolean(),
    startTime: z.string(),
    track: z.object({
      trackId: z.number(),
      trackName: z.string()
    }),
    winnerHelmet: z.object({
      pattern: z.number(),
      color1: z.string(),
      color2: z.string(),
      color3: z.string(),
      faceType: z.number(),
      helmetType: z.number()
    }),
    winnerId: z.number(),
    winnerLicenseLevel: z.number(),
    winnerName: z.string()
  }))
});

// ---- Response Types (inferred from schemas) ----

export type ResultsGetResponse = z.infer<typeof ResultsGet>;
export type ResultsEventLogResponse = z.infer<typeof ResultsEventLog>;
export type ResultsLapChartDataResponse = z.infer<typeof ResultsLapChartData>;
export type ResultsLapDataResponse = z.infer<typeof ResultsLapData>;
export type ResultsSearchHostedResponse = z.infer<typeof ResultsSearchHosted>;
export type ResultsSearchSeriesResponse = z.infer<typeof ResultsSearchSeries>;
export type ResultsSeasonResultsResponse = z.infer<typeof ResultsSeasonResults>;

// ---- Parameter Schemas ----

const ResultsGetParamsSchema = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  includeLicenses: z.optional(z.boolean()), // maps to: include_licenses
});

const ResultsEventLogParamsSchema = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
});

const ResultsLapChartDataParamsSchema = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
});

const ResultsLapDataParamsSchema = z.object({
  subsessionId: z.number(), // maps to: subsession_id
  simsessionNumber: z.number(), // The main event is 0; the preceding event is -1, and so on. // maps to: simsession_number
  custId: z.optional(z.number()), // Required if the subsession was a single-driver event. Optional for team events. If omitted for a team event then the laps driven by all the team's drivers will be included. // maps to: cust_id
  teamId: z.optional(z.number()), // Required if the subsession was a team event. // maps to: team_id
});

const ResultsSearchHostedParamsSchema = z.object({
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

const ResultsSearchSeriesParamsSchema = z.object({
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

const ResultsSeasonResultsParamsSchema = z.object({
  seasonId: z.number(), // maps to: season_id
  eventType: z.optional(z.number()), // Retrict to one event type: 2 - Practice; 3 - Qualify; 4 - Time Trial; 5 - Race // maps to: event_type
  raceWeekNum: z.optional(z.number()), // The first race week of a season is 0. // maps to: race_week_num
});

// ---- Exported Parameter Types ----

export type ResultsGetParams = z.infer<typeof ResultsGetParamsSchema>;
export type ResultsEventLogParams = z.infer<typeof ResultsEventLogParamsSchema>;
export type ResultsLapChartDataParams = z.infer<typeof ResultsLapChartDataParamsSchema>;
export type ResultsLapDataParams = z.infer<typeof ResultsLapDataParamsSchema>;
export type ResultsSearchHostedParams = z.infer<typeof ResultsSearchHostedParamsSchema>;
export type ResultsSearchSeriesParams = z.infer<typeof ResultsSearchSeriesParamsSchema>;
export type ResultsSeasonResultsParams = z.infer<typeof ResultsSeasonResultsParamsSchema>;

// ---- Exported Schemas ----

export {
  ResultsGetParamsSchema,
  ResultsEventLogParamsSchema,
  ResultsLapChartDataParamsSchema,
  ResultsLapDataParamsSchema,
  ResultsSearchHostedParamsSchema,
  ResultsSearchSeriesParamsSchema,
  ResultsSeasonResultsParamsSchema,
  ResultsGet,
  ResultsEventLog,
  ResultsLapChartData,
  ResultsLapData,
  ResultsSearchHosted,
  ResultsSearchSeries,
  ResultsSeasonResults,
};
