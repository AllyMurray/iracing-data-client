import type { IRacingClient } from "../client";
import type { MemberAwardsParams, MemberAwardInstancesParams, MemberChartDataParams, MemberGetParams, MemberInfoParams, MemberParticipationCreditsParams, MemberProfileParams } from "./member.types";

export class MemberService {
  constructor(private client: IRacingClient) {}

  /**
   * awards
   * @see https://members-ng.iracing.com/data/member/awards
   */
  async awards(params: MemberAwardsParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/awards", params);
  }

  /**
   * award_instances
   * @see https://members-ng.iracing.com/data/member/award_instances
   */
  async award_instances(params: MemberAwardInstancesParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/award_instances", params);
  }

  /**
   * chart_data
   * @see https://members-ng.iracing.com/data/member/chart_data
   */
  async chart_data(params: MemberChartDataParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/chart_data", params);
  }

  /**
   * get
   * @see https://members-ng.iracing.com/data/member/get
   */
  async get(params: MemberGetParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/get", params);
  }

  /**
   * info
   * @see https://members-ng.iracing.com/data/member/info
   */
  async info(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/info");
  }

  /**
   * participation_credits
   * @see https://members-ng.iracing.com/data/member/participation_credits
   */
  async participation_credits(): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/participation_credits");
  }

  /**
   * profile
   * @see https://members-ng.iracing.com/data/member/profile
   */
  async profile(params: MemberProfileParams): Promise<unknown> {
    return this.client.get("https://members-ng.iracing.com/data/member/profile", params);
  }

}