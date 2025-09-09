import * as z from "zod/mini";

// ---- Response Types ----

export interface TrackAssetsItem {
  coordinates: string;
  detailCopy: string; // maps from: detail_copy
  detailTechspecsCopy: null; // maps from: detail_techspecs_copy
  detailVideo: null; // maps from: detail_video
  folder: string;
  galleryImages: string; // maps from: gallery_images
  galleryPrefix: string; // maps from: gallery_prefix
  largeImage: string; // maps from: large_image
  logo: string;
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
  logo: string;
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
  trackTypes: any[]; // maps from: track_types
}

export type TrackGetResponse = TrackGetItem[];

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
};