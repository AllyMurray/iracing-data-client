import { z } from "zod-mini";

// ---- Response Types ----

export interface MemberAwardsResponse {
  type: string;
  data: any;
  dataUrl: string; // maps from: data_url
}

export interface MemberAwardInstancesResponse {
  type: string;
  data: any;
  dataUrl: string; // maps from: data_url
}

export interface MemberChartDataResponse {
  blackout: boolean;
  categoryId: number; // maps from: category_id
  chartType: number; // maps from: chart_type
  data: any[];
  success: boolean;
  custId: number; // maps from: cust_id
}

export interface MemberGetResponse {
  success: boolean;
  custIds: number[]; // maps from: cust_ids
  members: any[];
}

export interface MemberInfoResponse {
  custId: number; // maps from: cust_id
  displayName: string; // maps from: display_name
  firstName: string; // maps from: first_name
  lastName: string; // maps from: last_name
  onCarName: string; // maps from: on_car_name
  memberSince: string; // maps from: member_since
  flairId: number; // maps from: flair_id
  flairName: string; // maps from: flair_name
  flairShortname: string; // maps from: flair_shortname
  flairCountryCode: string; // maps from: flair_country_code
  lastLogin: string; // maps from: last_login
  readTc: string; // maps from: read_tc
  readPp: string; // maps from: read_pp
  readCompRules: string; // maps from: read_comp_rules
  flags: number;
  connectionType: string; // maps from: connection_type
  downloadServer: string; // maps from: download_server
  account: any;
  helmet: any;
  suit: any;
  licenses: any;
  carPackages: any[]; // maps from: car_packages
  trackPackages: any[]; // maps from: track_packages
  otherOwnedPackages: number[]; // maps from: other_owned_packages
  dev: boolean;
  alphaTester: boolean; // maps from: alpha_tester
  rainTester: boolean; // maps from: rain_tester
  broadcaster: boolean;
  restrictions: any;
  hasReadCompRules: boolean; // maps from: has_read_comp_rules
  hasReadNda: boolean; // maps from: has_read_nda
  flagsHex: string; // maps from: flags_hex
  hundredPctClub: boolean; // maps from: hundred_pct_club
  twentyPctDiscount: boolean; // maps from: twenty_pct_discount
  lastSeason: number; // maps from: last_season
  hasAdditionalContent: boolean; // maps from: has_additional_content
  hasReadTc: boolean; // maps from: has_read_tc
  hasReadPp: boolean; // maps from: has_read_pp
}

export interface MemberParticipationCreditsItem {
  custId: number; // maps from: cust_id
  seasonId: number; // maps from: season_id
  seriesId: number; // maps from: series_id
  seriesName: string; // maps from: series_name
  licenseGroup: number; // maps from: license_group
  licenseGroupName: string; // maps from: license_group_name
  participationCredits: number; // maps from: participation_credits
  minWeeks: number; // maps from: min_weeks
  weeks: number;
  earnedCredits: number; // maps from: earned_credits
  totalCredits: number; // maps from: total_credits
}

export type MemberParticipationCreditsResponse = MemberParticipationCreditsItem[];

export interface MemberProfileResponse {
  recentAwards: any[]; // maps from: recent_awards
  activity: any;
  success: boolean;
  imageUrl: string; // maps from: image_url
  memberInfo: any; // maps from: member_info
  disabled: boolean;
  licenseHistory: any[]; // maps from: license_history
  recentEvents: any[]; // maps from: recent_events
  custId: number; // maps from: cust_id
  isGenericImage: boolean; // maps from: is_generic_image
  followCounts: any; // maps from: follow_counts
}

// ---- Parameter Schemas ----

const MemberAwardsParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
});

const MemberAwardInstancesParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
  awardId: z.number(), // maps to: award_id
});

const MemberChartDataParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
  categoryId: z.number(), // 1 - Oval; 2 - Road; 3 - Dirt oval; 4 - Dirt road // maps to: category_id
  chartType: z.number(), // 1 - iRating; 2 - TT Rating; 3 - License/SR // maps to: chart_type
});

const MemberGetParamsSchema = z.object({
  custIds: z.array(z.number()), // ?cust_ids=2,3,4 // maps to: cust_ids
  includeLicenses: z.boolean().optional(), // maps to: include_licenses
});

const MemberInfoParamsSchema = z.object({
});

const MemberParticipationCreditsParamsSchema = z.object({
});

const MemberProfileParamsSchema = z.object({
  custId: z.number().optional(), // Defaults to the authenticated member. // maps to: cust_id
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
};