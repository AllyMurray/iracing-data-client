import * as z from "zod/mini";

// ---- Response Schemas ----

const CarAssetsSchema = z.record(z.string(), z.object({
  carId: z.number(),
  carRules: z.array(z.unknown()),
  detailCopy: z.string(),
  detailScreenShotImages: z.string(),
  detailTechspecsCopy: z.string(),
  folder: z.string(),
  galleryImages: z.optional(z.union([z.string(), z.null()])),
  galleryPrefix: z.optional(z.union([z.string(), z.null()])),
  groupImage: z.optional(z.union([z.string(), z.null()])),
  groupName: z.optional(z.union([z.string(), z.null()])),
  largeImage: z.string(),
  logo: z.optional(z.union([z.string(), z.null()])),
  smallImage: z.string(),
  sponsorLogo: z.optional(z.union([z.string(), z.null()])),
  templatePath: z.optional(z.union([z.string(), z.null()]))
}));
const CarGetSchema = z.array(z.object({
  aiEnabled: z.boolean(),
  allowNumberColors: z.boolean(),
  allowNumberFont: z.boolean(),
  allowSponsor1: z.boolean(),
  allowSponsor2: z.boolean(),
  allowWheelColor: z.boolean(),
  awardExempt: z.boolean(),
  carConfigDefs: z.array(z.unknown()),
  carConfigs: z.array(z.unknown()),
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
  forumUrl: z.optional(z.union([z.string(), z.null()])),
  freeWithSubscription: z.boolean(),
  hasHeadlights: z.boolean(),
  hasMultipleDryTireTypes: z.boolean(),
  hasRainCapableTireTypes: z.boolean(),
  hp: z.number(),
  isPsPurchasable: z.boolean(),
  logo: z.optional(z.union([z.string(), z.null()])),
  maxPowerAdjustPct: z.number(),
  maxWeightPenaltyKg: z.number(),
  minPowerAdjustPct: z.number(),
  packageId: z.number(),
  patterns: z.number(),
  price: z.number(),
  priceDisplay: z.optional(z.union([z.string(), z.null()])),
  rainEnabled: z.boolean(),
  retired: z.boolean(),
  searchFilters: z.string(),
  sku: z.number(),
  smallImage: z.string(),
  sponsorLogo: z.optional(z.union([z.string(), z.null()]))
}));

// ---- Response Types (inferred from schemas) ----

export type CarAssetsResponse = z.infer<typeof CarAssetsSchema>;
export type CarGetResponse = z.infer<typeof CarGetSchema>;

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
  CarAssetsSchema,
  CarGetSchema,
};