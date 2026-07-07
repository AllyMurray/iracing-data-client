import type { IRacingClient } from "../client";
import type { MemberAwardsParams, MemberAwardInstancesParams, MemberChartDataParams, MemberGetParams, MemberProfileParams, MemberAwardsResponse, MemberAwardInstancesResponse, MemberChartDataResponse, MemberGetResponse, MemberInfoResponse, MemberParticipationCreditsResponse, MemberProfileResponse } from "./types";
import * as z from "zod/mini";
import { MemberAwards, MemberAwardInstances, MemberChartData, MemberGet, MemberInfo, MemberParticipationCredits, MemberProfile } from "./types";

const awardsParams = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

const awardInstancesParams = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  awardId: z.number(), // maps to: award_id
});

const chartDataParams = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
  categoryId: z.number(), // 1 - Oval; 2 - Road; 3 - Dirt oval; 4 - Dirt road // maps to: category_id
  chartType: z.number(), // 1 - iRating; 2 - TT Rating; 3 - License/SR // maps to: chart_type
});

const getParams = z.object({
  custIds: z.array(z.number()), // ?cust_ids=2,3,4 // maps to: cust_ids
  includeLicenses: z.optional(z.boolean()), // maps to: include_licenses
});

const profileParams = z.object({
  custId: z.optional(z.number()), // Defaults to the authenticated member. // maps to: cust_id
});

export class MemberService {
  constructor(private client: IRacingClient) {}

  /**
   * awards
   * @see https://members-ng.iracing.com/data/member/awards
   * @sample member.awards.json
   */
  async awards(params?: MemberAwardsParams): Promise<MemberAwardsResponse> {
    return this.client.get<MemberAwardsResponse>("https://members-ng.iracing.com/data/member/awards", { params, paramsValidator: awardsParams, schema: MemberAwards });
  }

  /**
   * award_instances
   * @see https://members-ng.iracing.com/data/member/award_instances
   * @sample member.award_instances.json
   */
  async awardInstances(params: MemberAwardInstancesParams): Promise<MemberAwardInstancesResponse> {
    return this.client.get<MemberAwardInstancesResponse>("https://members-ng.iracing.com/data/member/award_instances", { params, paramsValidator: awardInstancesParams, schema: MemberAwardInstances });
  }

  /**
   * chart_data
   * @see https://members-ng.iracing.com/data/member/chart_data
   * @sample member.chart_data.json
   */
  async chartData(params: MemberChartDataParams): Promise<MemberChartDataResponse> {
    return this.client.get<MemberChartDataResponse>("https://members-ng.iracing.com/data/member/chart_data", { params, paramsValidator: chartDataParams, schema: MemberChartData });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/member/get
   * @sample member.get.json
   */
  async get(params: MemberGetParams): Promise<MemberGetResponse> {
    return this.client.get<MemberGetResponse>("https://members-ng.iracing.com/data/member/get", { params, paramsValidator: getParams, schema: MemberGet });
  }

  /**
   * info
   * @see https://members-ng.iracing.com/data/member/info
   * @sample member.info.json
   */
  async info(): Promise<MemberInfoResponse> {
    return this.client.get<MemberInfoResponse>("https://members-ng.iracing.com/data/member/info", { schema: MemberInfo });
  }

  /**
   * participation_credits
   * @see https://members-ng.iracing.com/data/member/participation_credits
   * @sample member.participation_credits.json
   */
  async participationCredits(): Promise<MemberParticipationCreditsResponse> {
    return this.client.get<MemberParticipationCreditsResponse>("https://members-ng.iracing.com/data/member/participation_credits", { schema: MemberParticipationCredits });
  }

  /**
   * profile
   * @see https://members-ng.iracing.com/data/member/profile
   * @sample member.profile.json
   */
  async profile(params?: MemberProfileParams): Promise<MemberProfileResponse> {
    return this.client.get<MemberProfileResponse>("https://members-ng.iracing.com/data/member/profile", { params, paramsValidator: profileParams, schema: MemberProfile });
  }

}