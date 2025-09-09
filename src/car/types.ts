import * as z from "zod/mini";

// ---- Response Types ----

export interface CarAssetsItem {
  carId: number; // maps from: car_id
  carRules: any[]; // maps from: car_rules
  detailCopy: string; // maps from: detail_copy
  detailScreenShotImages: string; // maps from: detail_screen_shot_images
  detailTechspecsCopy: string; // maps from: detail_techspecs_copy
  folder: string;
  galleryImages?: string | null; // maps from: gallery_images
  galleryPrefix?: string | null; // maps from: gallery_prefix
  groupImage?: string | null; // maps from: group_image
  groupName?: string | null; // maps from: group_name
  largeImage: string; // maps from: large_image
  logo?: string | null;
  smallImage: string; // maps from: small_image
  sponsorLogo?: string | null; // maps from: sponsor_logo
  templatePath?: string | null; // maps from: template_path
}

export interface CarAssetsResponse {
  [key: string]: CarAssetsItem;
}

export interface CarGetItem {
  aiEnabled: boolean; // maps from: ai_enabled
  allowNumberColors: boolean; // maps from: allow_number_colors
  allowNumberFont: boolean; // maps from: allow_number_font
  allowSponsor1: boolean; // maps from: allow_sponsor1
  allowSponsor2: boolean; // maps from: allow_sponsor2
  allowWheelColor: boolean; // maps from: allow_wheel_color
  awardExempt: boolean; // maps from: award_exempt
  carConfigDefs: any[]; // maps from: car_config_defs
  carConfigs: any[]; // maps from: car_configs
  carDirpath: string; // maps from: car_dirpath
  carId: number; // maps from: car_id
  carName: string; // maps from: car_name
  carNameAbbreviated: string; // maps from: car_name_abbreviated
  carTypes: any[]; // maps from: car_types
  carWeight: number; // maps from: car_weight
  categories: string[];
  created: string;
  firstSale: string; // maps from: first_sale
  folder: string;
  forumUrl?: string | null; // maps from: forum_url
  freeWithSubscription: boolean; // maps from: free_with_subscription
  hasHeadlights: boolean; // maps from: has_headlights
  hasMultipleDryTireTypes: boolean; // maps from: has_multiple_dry_tire_types
  hasRainCapableTireTypes: boolean; // maps from: has_rain_capable_tire_types
  hp: number;
  isPsPurchasable: boolean; // maps from: is_ps_purchasable
  logo?: string | null;
  maxPowerAdjustPct: number; // maps from: max_power_adjust_pct
  maxWeightPenaltyKg: number; // maps from: max_weight_penalty_kg
  minPowerAdjustPct: number; // maps from: min_power_adjust_pct
  packageId: number; // maps from: package_id
  patterns: number;
  price: number;
  priceDisplay?: string | null; // maps from: price_display
  rainEnabled: boolean; // maps from: rain_enabled
  retired: boolean;
  searchFilters: string; // maps from: search_filters
  sku: number;
  smallImage: string; // maps from: small_image
  sponsorLogo?: string | null; // maps from: sponsor_logo
}

export type CarGetResponse = CarGetItem[];

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