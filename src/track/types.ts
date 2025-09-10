import * as z from "zod/mini";

// ---- Common Schemas ----

const TrackMapLayersSchema = z.object({
  background: z.string(),
  inactive: z.string(),
  active: z.string(),
  pitroad: z.string(),
  startFinish: z.string(), // maps from: start-finish
  turns: z.string()
});

// ---- Response Schemas ----

const TrackAssets = z.record(z.string(), z.object({
  coordinates: z.optional(z.nullable(z.string())),
  detailCopy: z.optional(z.nullable(z.string())),
  detailTechspecsCopy: z.optional(z.nullable(z.string())),
  detailVideo: z.optional(z.nullable(z.string())),
  folder: z.optional(z.nullable(z.string())),
  galleryImages: z.optional(z.nullable(z.string())),
  galleryPrefix: z.optional(z.nullable(z.string())),
  largeImage: z.optional(z.nullable(z.string())),
  logo: z.optional(z.nullable(z.string())),
  north: z.optional(z.nullable(z.string())),
  numSvgImages: z.optional(z.nullable(z.number())),
  smallImage: z.optional(z.nullable(z.string())),
  trackId: z.optional(z.nullable(z.number())),
  trackMap: z.optional(z.nullable(z.string())),
  trackMapLayers: z.optional(z.nullable(z.object({
    background: z.string(),
    inactive: z.string(),
    active: z.string(),
    pitroad: z.string(),
    startFinish: z.string(),
    turns: z.string()
  })))
}));
const TrackGet = z.array(z.object({
  aiEnabled: z.boolean(),
  allowPitlaneCollisions: z.boolean(),
  allowRollingStart: z.boolean(),
  allowStandingStart: z.boolean(),
  awardExempt: z.boolean(),
  category: z.string(),
  categoryId: z.number(),
  closes: z.string(),
  configName: z.optional(z.string()),
  cornersPerLap: z.number(),
  created: z.string(),
  firstSale: z.string(),
  folder: z.string(),
  freeWithSubscription: z.boolean(),
  fullyLit: z.boolean(),
  gridStalls: z.number(),
  hasOptPath: z.boolean(),
  hasShortParadeLap: z.boolean(),
  hasStartZone: z.boolean(),
  hasSvgMap: z.boolean(),
  isDirt: z.boolean(),
  isOval: z.boolean(),
  isPsPurchasable: z.boolean(),
  lapScoring: z.number(),
  latitude: z.number(),
  location: z.string(),
  logo: z.string(),
  longitude: z.number(),
  maxCars: z.number(),
  nightLighting: z.boolean(),
  numberPitstalls: z.number(),
  opens: z.string(),
  packageId: z.number(),
  pitRoadSpeedLimit: z.optional(z.number()),
  price: z.number(),
  priority: z.number(),
  purchasable: z.boolean(),
  qualifyLaps: z.number(),
  rainEnabled: z.boolean(),
  restartOnLeft: z.boolean(),
  retired: z.boolean(),
  searchFilters: z.string(),
  siteUrl: z.optional(z.string()),
  sku: z.number(),
  smallImage: z.string(),
  soloLaps: z.number(),
  startOnLeft: z.boolean(),
  supportsGripCompound: z.boolean(),
  techTrack: z.boolean(),
  timeZone: z.string(),
  trackConfigLength: z.number(),
  trackDirpath: z.string(),
  trackId: z.number(),
  trackName: z.string(),
  trackType: z.number(),
  trackTypeText: z.string(),
  trackTypes: z.array(z.object({
    trackType: z.string()
  })),
  priceDisplay: z.optional(z.string()),
  nominalLapTime: z.optional(z.number()),
  banking: z.optional(z.string())
}));

// ---- Response Types (inferred from schemas) ----

export type TrackAssetsResponse = z.infer<typeof TrackAssets>;
export type TrackGetResponse = z.infer<typeof TrackGet>;

// ---- Parameter Schemas ----

const TrackAssetsParamsSchema = z.object({
});

const TrackGetParamsSchema = z.object({
});

// ---- Exported Parameter Types ----

export type TrackAssetsParams = z.infer<typeof TrackAssetsParamsSchema>;
export type TrackGetParams = z.infer<typeof TrackGetParamsSchema>;

// ---- Exported Schemas ----

export {
  TrackAssetsParamsSchema,
  TrackGetParamsSchema,
  TrackAssets,
  TrackGet,
};