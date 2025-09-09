import * as z from "zod/mini";

// ---- Response Types ----

export interface TrackAssetsItem {
  coordinates: string;
  detailCopy: string; // maps from: detail_copy
  detailTechspecsCopy?: string | null; // maps from: detail_techspecs_copy
  detailVideo?: string | null; // maps from: detail_video
  folder: string;
  galleryImages?: string | null; // maps from: gallery_images
  galleryPrefix?: string | null; // maps from: gallery_prefix
  largeImage: string; // maps from: large_image
  logo?: string | null;
  north: string;
  numSvgImages: number; // maps from: num_svg_images
  smallImage: string; // maps from: small_image
  trackId: number; // maps from: track_id
  trackMap: string; // maps from: track_map
  trackMapLayers: any; // maps from: track_map_layers
}

export interface TrackAssetsResponse {
  [key: string]: TrackAssetsItem;
}

export interface TrackGetItem {
  aiEnabled: boolean; // maps from: ai_enabled
  allowPitlaneCollisions: boolean; // maps from: allow_pitlane_collisions
  allowRollingStart: boolean; // maps from: allow_rolling_start
  allowStandingStart: boolean; // maps from: allow_standing_start
  awardExempt: boolean; // maps from: award_exempt
  category: string;
  categoryId: number; // maps from: category_id
  closes: string;
  configName: string; // maps from: config_name
  cornersPerLap: number; // maps from: corners_per_lap
  created: string;
  firstSale: string; // maps from: first_sale
  folder: string;
  freeWithSubscription: boolean; // maps from: free_with_subscription
  fullyLit: boolean; // maps from: fully_lit
  gridStalls: number; // maps from: grid_stalls
  hasOptPath: boolean; // maps from: has_opt_path
  hasShortParadeLap: boolean; // maps from: has_short_parade_lap
  hasStartZone: boolean; // maps from: has_start_zone
  hasSvgMap: boolean; // maps from: has_svg_map
  isDirt: boolean; // maps from: is_dirt
  isOval: boolean; // maps from: is_oval
  isPsPurchasable: boolean; // maps from: is_ps_purchasable
  lapScoring: number; // maps from: lap_scoring
  latitude: number;
  location: string;
  logo?: string | null;
  longitude: number;
  maxCars: number; // maps from: max_cars
  nightLighting: boolean; // maps from: night_lighting
  numberPitstalls: number; // maps from: number_pitstalls
  opens: string;
  packageId: number; // maps from: package_id
  pitRoadSpeedLimit: number; // maps from: pit_road_speed_limit
  price: number;
  priority: number;
  purchasable: boolean;
  qualifyLaps: number; // maps from: qualify_laps
  rainEnabled: boolean; // maps from: rain_enabled
  restartOnLeft: boolean; // maps from: restart_on_left
  retired: boolean;
  searchFilters: string; // maps from: search_filters
  siteUrl: string; // maps from: site_url
  sku: number;
  smallImage: string; // maps from: small_image
  soloLaps: number; // maps from: solo_laps
  startOnLeft: boolean; // maps from: start_on_left
  supportsGripCompound: boolean; // maps from: supports_grip_compound
  techTrack: boolean; // maps from: tech_track
  timeZone: string; // maps from: time_zone
  trackConfigLength: number; // maps from: track_config_length
  trackDirpath: string; // maps from: track_dirpath
  trackId: number; // maps from: track_id
  trackName: string; // maps from: track_name
  trackType: number; // maps from: track_type
  trackTypeText: string; // maps from: track_type_text
  trackTypes: Array<any>; // maps from: track_types
}

export type TrackGetResponse = Array<TrackGetItem>;

// ---- Response Schemas ----

const TrackAssetsSchema = z.record(z.string(), z.object({
  coordinates: z.string(),
  detailCopy: z.string(),
  detailTechspecsCopy: z.optional(z.union([z.string(), z.null()])),
  detailVideo: z.optional(z.union([z.string(), z.null()])),
  folder: z.string(),
  galleryImages: z.optional(z.union([z.string(), z.null()])),
  galleryPrefix: z.optional(z.union([z.string(), z.null()])),
  largeImage: z.string(),
  logo: z.optional(z.union([z.string(), z.null()])),
  north: z.string(),
  numSvgImages: z.number(),
  smallImage: z.string(),
  trackId: z.number(),
  trackMap: z.string(),
  trackMapLayers: z.object({
  background: z.string(),
  inactive: z.string(),
  active: z.string(),
  pitroad: z.string(),
  startFinish: z.string(),
  turns: z.string()
})
}));

const TrackGetSchema = z.array(z.object({
  aiEnabled: z.boolean(),
  allowPitlaneCollisions: z.boolean(),
  allowRollingStart: z.boolean(),
  allowStandingStart: z.boolean(),
  awardExempt: z.boolean(),
  category: z.string(),
  categoryId: z.number(),
  closes: z.string(),
  configName: z.string(),
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
  logo: z.optional(z.union([z.string(), z.null()])),
  longitude: z.number(),
  maxCars: z.number(),
  nightLighting: z.boolean(),
  numberPitstalls: z.number(),
  opens: z.string(),
  packageId: z.number(),
  pitRoadSpeedLimit: z.number(),
  price: z.number(),
  priority: z.number(),
  purchasable: z.boolean(),
  qualifyLaps: z.number(),
  rainEnabled: z.boolean(),
  restartOnLeft: z.boolean(),
  retired: z.boolean(),
  searchFilters: z.string(),
  siteUrl: z.string(),
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
}))
}));

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
  TrackAssetsSchema,
  TrackGetSchema,
};