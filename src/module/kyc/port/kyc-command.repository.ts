import { MemberGetMember } from "../entity/member-get-member";
import { PlanPreference } from "../entity/plan-preference";
import { Referral } from "../entity/referral";

export abstract class KycCommandRepository {
  public abstract createMemberGetMember(mgm: MemberGetMember): Promise<void>;
  public abstract createReferral(referral: Referral): Promise<void>;
  public abstract createPlanPreference(
    planPreference: PlanPreference,
  ): Promise<void>;
}
