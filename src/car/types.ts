import * as z from "zod/mini";

// ---- Response Schemas ----

const CarAssets = z.record(z.string(), z.object({
  carId: z.optional(z.nullable(z.number())),
  carRules: z.optional(z.nullable(z.array(z.unknown()))),
  detailCopy: z.optional(z.nullable(z.string())),
  detailScreenShotImages: z.optional(z.nullable(z.string())),
  detailTechspecsCopy: z.optional(z.nullable(z.string())),
  folder: z.optional(z.nullable(z.string())),
  galleryImages: z.optional(z.nullable(z.string())),
  galleryPrefix: z.optional(z.nullable(z.string())),
  groupImage: z.optional(z.nullable(z.string())),
  groupName: z.optional(z.nullable(z.string())),
  largeImage: z.optional(z.nullable(z.string())),
  logo: z.optional(z.nullable(z.string())),
  smallImage: z.optional(z.nullable(z.string())),
  sponsorLogo: z.optional(z.nullable(z.string())),
  templatePath: z.optional(z.nullable(z.string()))
}));
const CarGet = z.array(z.object({
  aiEnabled: z.boolean(),
  allowNumberColors: z.boolean(),
  allowNumberFont: z.boolean(),
  allowSponsor1: z.boolean(),
  allowSponsor2: z.boolean(),
  allowWheelColor: z.boolean(),
  awardExempt: z.boolean(),
  carConfigDefs: z.array(z.object({
    carcfg: z.number(),
    cfgSubdir: z.nullable(z.string()),
    customPaintExt: z.nullable(z.string()),
    name: z.string()
  })),
  carConfigs: z.array(z.object({
    carcfg: z.number(),
    trackId: z.optional(z.number()),
    trackType: z.optional(z.number())
  })),
  carDirpath: z.string(),
  carId: z.number(),
  carName: z.string(),
  carNameAbbreviated: z.string(),
  carTypes: z.array(z.object({
    carType: z.string()
  })),
  carWeight: z.number(),
  categories: z.array(z.string()),
  created: z.string(),
  firstSale: z.string(),
  folder: z.string(),
  forumUrl: z.optional(z.string()),
  freeWithSubscription: z.boolean(),
  hasHeadlights: z.boolean(),
  hasMultipleDryTireTypes: z.boolean(),
  hasRainCapableTireTypes: z.boolean(),
  hp: z.number(),
  isPsPurchasable: z.boolean(),
  logo: z.nullable(z.string()),
  maxPowerAdjustPct: z.number(),
  maxWeightPenaltyKg: z.number(),
  minPowerAdjustPct: z.number(),
  packageId: z.number(),
  patterns: z.number(),
  price: z.number(),
  priceDisplay: z.optional(z.string()),
  rainEnabled: z.boolean(),
  retired: z.boolean(),
  searchFilters: z.string(),
  sku: z.number(),
  smallImage: z.string(),
  sponsorLogo: z.nullable(z.string()),
  carMake: z.optional(z.string()),
  carModel: z.optional(z.string()),
  paintRules: z.optional(z.record(z.string(), z.unknown())),
  siteUrl: z.optional(z.string())
}));

// ---- Response Types (inferred from schemas) ----

export type CarAssetsResponse = z.infer<typeof CarAssets>;
export type CarGetResponse = z.infer<typeof CarGet>;

// ---- Parameter Schemas ----

const CarAssetsParamsSchema = z.object({
});

const CarGetParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type CarAssetsParams = z.infer<typeof CarAssetsParamsSchema>;
export type CarGetParams = z.infer<typeof CarGetParamsSchema>;

// ---- Exported Schemas ----

export {
  CarAssetsParamsSchema,
  CarGetParamsSchema,
  CarAssets,
  CarGet,
};