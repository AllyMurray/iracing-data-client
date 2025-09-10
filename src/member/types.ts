import * as z from "zod/mini";

// ---- Response Schemas ----

const MemberAwards = z.object({
  type: z.string(),
  data: z.object({
    success: z.boolean(),
    custId: z.number(),
    awardCount: z.number()
  }),
  dataUrl: z.string()
});
const MemberAwardInstances = z.object({
  type: z.string(),
  data: z.object({
    success: z.boolean(),
    custId: z.number(),
    awardId: z.number(),
    awardCount: z.number()
  }),
  dataUrl: z.string()
});
const MemberChartData = z.object({
  blackout: z.boolean(),
  categoryId: z.number(),
  chartType: z.number(),
  data: z.array(z.object({
    when: z.string(),
    value: z.number()
  })),
  success: z.boolean(),
  custId: z.number()
});
const MemberGet = z.object({
  success: z.boolean(),
  custIds: z.array(z.number()),
  members: z.array(z.object({
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
    lastLogin: z.string(),
    memberSince: z.string(),
    flairId: z.number(),
    flairName: z.string(),
    flairShortname: z.string(),
    ai: z.boolean()
  }))
});
const MemberInfo = z.object({
  custId: z.number(),
  displayName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  onCarName: z.string(),
  memberSince: z.string(),
  flairId: z.number(),
  flairName: z.string(),
  flairShortname: z.string(),
  flairCountryCode: z.string(),
  lastLogin: z.string(),
  readTc: z.string(),
  readPp: z.string(),
  readCompRules: z.string(),
  flags: z.number(),
  connectionType: z.string(),
  downloadServer: z.string(),
  account: z.object({
    irDollars: z.number(),
    irCredits: z.number(),
    status: z.string(),
    countryRules: z.nullable(z.unknown())
  }),
  helmet: z.object({
    pattern: z.number(),
    color1: z.string(),
    color2: z.string(),
    color3: z.string(),
    faceType: z.number(),
    helmetType: z.number()
  }),
  suit: z.object({
    pattern: z.number(),
    color1: z.string(),
    color2: z.string(),
    color3: z.string(),
    bodyType: z.number()
  }),
  licenses: z.object({
    oval: z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    }),
    sportsCar: z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    }),
    formulaCar: z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    }),
    dirtOval: z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    }),
    dirtRoad: z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    })
  }),
  carPackages: z.array(z.object({
    packageId: z.number(),
    contentIds: z.array(z.number())
  })),
  trackPackages: z.array(z.object({
    packageId: z.number(),
    contentIds: z.array(z.number())
  })),
  otherOwnedPackages: z.array(z.number()),
  dev: z.boolean(),
  alphaTester: z.boolean(),
  rainTester: z.boolean(),
  broadcaster: z.boolean(),
  restrictions: z.object({

  }),
  hasReadCompRules: z.boolean(),
  hasReadNda: z.boolean(),
  flagsHex: z.string(),
  hundredPctClub: z.boolean(),
  twentyPctDiscount: z.boolean(),
  lastSeason: z.number(),
  hasAdditionalContent: z.boolean(),
  hasReadTc: z.boolean(),
  hasReadPp: z.boolean()
});
const MemberParticipationCredits = z.array(z.object({
  custId: z.number(),
  seasonId: z.number(),
  seriesId: z.number(),
  seriesName: z.string(),
  licenseGroup: z.number(),
  licenseGroupName: z.string(),
  participationCredits: z.number(),
  minWeeks: z.number(),
  weeks: z.number(),
  earnedCredits: z.number(),
  totalCredits: z.number()
}));
const MemberProfile = z.object({
  recentAwards: z.array(z.object({
    memberAwardId: z.number(),
    awardId: z.number(),
    achievement: z.boolean(),
    awardCount: z.number(),
    awardDate: z.string(),
    awardOrder: z.number(),
    awardedDescription: z.string(),
    description: z.string(),
    groupName: z.string(),
    hasPdf: z.boolean(),
    iconUrlLarge: z.string(),
    iconUrlSmall: z.string(),
    iconUrlUnawarded: z.string(),
    name: z.string(),
    progress: z.optional(z.number()),
    progressLabel: z.optional(z.string()),
    threshold: z.optional(z.number()),
    viewed: z.boolean(),
    weight: z.number(),
    subsessionId: z.optional(z.number()),
    custId: z.optional(z.number())
  })),
  activity: z.object({
    recent30daysCount: z.number(),
    prev30daysCount: z.number(),
    consecutiveWeeks: z.number(),
    mostConsecutiveWeeks: z.number()
  }),
  success: z.boolean(),
  imageUrl: z.string(),
  memberInfo: z.object({
    ai: z.boolean(),
    country: z.nullable(z.string()),
    countryCode: z.string(),
    custId: z.number(),
    displayName: z.string(),
    flairId: z.number(),
    flairName: z.string(),
    flairShortname: z.string(),
    helmet: z.object({
      pattern: z.number(),
      color1: z.string(),
      color2: z.string(),
      color3: z.string(),
      faceType: z.number(),
      helmetType: z.number()
    }),
    lastLogin: z.string(),
    licenses: z.array(z.object({
      categoryId: z.number(),
      category: z.string(),
      categoryName: z.string(),
      licenseLevel: z.number(),
      safetyRating: z.number(),
      cpi: z.number(),
      irating: z.number(),
      ttRating: z.number(),
      mprNumRaces: z.number(),
      color: z.string(),
      groupName: z.string(),
      groupId: z.number(),
      proPromotable: z.boolean(),
      seq: z.number(),
      mprNumTts: z.number()
    })),
    memberSince: z.string()
  }),
  disabled: z.boolean(),
  licenseHistory: z.array(z.object({
    categoryId: z.number(),
    category: z.string(),
    categoryName: z.string(),
    licenseLevel: z.number(),
    safetyRating: z.number(),
    cpi: z.number(),
    irating: z.number(),
    ttRating: z.number(),
    color: z.string(),
    groupName: z.string(),
    groupId: z.number(),
    seq: z.number()
  })),
  recentEvents: z.array(z.object({
    eventType: z.string(),
    subsessionId: z.number(),
    startTime: z.string(),
    eventId: z.number(),
    eventName: z.string(),
    simsessionType: z.number(),
    startingPosition: z.number(),
    finishPosition: z.number(),
    bestLapTime: z.number(),
    percentRank: z.number(),
    carId: z.number(),
    carName: z.string(),
    logoUrl: z.nullable(z.string()),
    track: z.object({
      configName: z.string(),
      trackId: z.number(),
      trackName: z.string()
    })
  })),
  custId: z.number(),
  isGenericImage: z.boolean(),
  followCounts: z.object({
    followers: z.number(),
    follows: z.number()
  })
});

// ---- Response Types (inferred from schemas) ----

export type MemberAwardsResponse = z.infer<typeof MemberAwards>;
export type MemberAwardInstancesResponse = z.infer<typeof MemberAwardInstances>;
export type MemberChartDataResponse = z.infer<typeof MemberChartData>;
export type MemberGetResponse = z.infer<typeof MemberGet>;
export type MemberInfoResponse = z.infer<typeof MemberInfo>;
export type MemberParticipationCreditsResponse = z.infer<typeof MemberParticipationCredits>;
export type MemberProfileResponse = z.infer<typeof MemberProfile>;

// ---- Parameter Schemas ----

const MemberAwardsParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const MemberAwardInstancesParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  awardId: z.number(), // maps to: award_id
});

const MemberChartDataParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  categoryId: z.number(), // 1 - Oval; 2 - Road; 3 - Dirt oval; 4 - Dirt road // maps to: category_id
  chartType: z.number(), // 1 - iRating; 2 - TT Rating; 3 - License/SR // maps to: chart_type
});

const MemberGetParamsSchema = z.object({
  custIds: z.array(z.number()), // ?cust_ids=2,3,4 // maps to: cust_ids
  includeLicenses: z.optional(z.boolean()), // maps to: include_licenses
});

const MemberInfoParamsSchema = z.object({
});

const MemberParticipationCreditsParamsSchema = z.object({
});

const MemberProfileParamsSchema = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

// ---- Exported Parameter Types ----

export type MemberAwardsParams = z.infer<typeof MemberAwardsParamsSchema>;
export type MemberAwardInstancesParams = z.infer<typeof MemberAwardInstancesParamsSchema>;
export type MemberChartDataParams = z.infer<typeof MemberChartDataParamsSchema>;
export type MemberGetParams = z.infer<typeof MemberGetParamsSchema>;
export type MemberInfoParams = z.infer<typeof MemberInfoParamsSchema>;
export type MemberParticipationCreditsParams = z.infer<typeof MemberParticipationCreditsParamsSchema>;
export type MemberProfileParams = z.infer<typeof MemberProfileParamsSchema>;

// ---- Exported Schemas ----

export {
  MemberAwardsParamsSchema,
  MemberAwardInstancesParamsSchema,
  MemberChartDataParamsSchema,
  MemberGetParamsSchema,
  MemberInfoParamsSchema,
  MemberParticipationCreditsParamsSchema,
  MemberProfileParamsSchema,
  MemberAwards,
  MemberAwardInstances,
  MemberChartData,
  MemberGet,
  MemberInfo,
  MemberParticipationCredits,
  MemberProfile,
};