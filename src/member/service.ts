import type { IRacingClient } from "../client";
import type { MemberAwardsParams, MemberAwardInstancesParams, MemberChartDataParams, MemberGetParams, MemberInfoParams, MemberParticipationCreditsParams, MemberProfileParams, MemberAwardsResponse, MemberAwardInstancesResponse, MemberChartDataResponse, MemberGetResponse, MemberInfoResponse, MemberParticipationCreditsResponse, MemberProfileResponse } from "./types";
import { MemberAwardsSchema, MemberAwardInstancesSchema, MemberChartDataSchema, MemberGetSchema, MemberInfoSchema, MemberParticipationCreditsSchema, MemberProfileSchema } from "./types";

export class MemberService {
  constructor(private client: IRacingClient) {}

  /**
   * awards
   * @see https://members-ng.iracing.com/data/member/awards
   * @sample member.awards.json
   */
  async awards(params: MemberAwardsParams): Promise<MemberAwardsResponse> {
    return this.client.get<MemberAwardsResponse>("https://members-ng.iracing.com/data/member/awards", { params, schema: MemberAwardsSchema as any });
  }

  /**
   * award_instances
   * @see https://members-ng.iracing.com/data/member/award_instances
   * @sample member.award_instances.json
   */
  async awardInstances(params: MemberAwardInstancesParams): Promise<MemberAwardInstancesResponse> {
    return this.client.get<MemberAwardInstancesResponse>("https://members-ng.iracing.com/data/member/award_instances", { params, schema: MemberAwardInstancesSchema as any });
  }

  /**
   * chart_data
   * @see https://members-ng.iracing.com/data/member/chart_data
   * @sample member.chart_data.json
   */
  async chartData(params: MemberChartDataParams): Promise<MemberChartDataResponse> {
    return this.client.get<MemberChartDataResponse>("https://members-ng.iracing.com/data/member/chart_data", { params, schema: MemberChartDataSchema as any });
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/member/get
   * @sample member.get.json
   */
  async get(params: MemberGetParams): Promise<MemberGetResponse> {
    return this.client.get<MemberGetResponse>("https://members-ng.iracing.com/data/member/get", { params, schema: MemberGetSchema as any });
  }

  /**
   * info
   * @see https://members-ng.iracing.com/data/member/info
   * @sample member.info.json
   */
  async info(): Promise<MemberInfoResponse> {
    return this.client.get<MemberInfoResponse>("https://members-ng.iracing.com/data/member/info", { schema: MemberInfoSchema });
  }

  /**
   * participation_credits
   * @see https://members-ng.iracing.com/data/member/participation_credits
   * @sample member.participation_credits.json
   */
  async participationCredits(): Promise<MemberParticipationCreditsResponse> {
    return this.client.get<MemberParticipationCreditsResponse>("https://members-ng.iracing.com/data/member/participation_credits", { schema: MemberParticipationCreditsSchema });
  }

  /**
   * profile
   * @see https://members-ng.iracing.com/data/member/profile
   * @sample member.profile.json
   */
  async profile(params: MemberProfileParams): Promise<MemberProfileResponse> {
    return this.client.get<MemberProfileResponse>("https://members-ng.iracing.com/data/member/profile", { params, schema: MemberProfileSchema as any });
  }

}