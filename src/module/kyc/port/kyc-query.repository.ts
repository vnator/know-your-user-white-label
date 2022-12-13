import { KycId } from "../entity/kyc";
import { MemberGetMember } from "../entity/member-get-member";
import { PlanPreference } from "../entity/plan-preference";
import { Referral } from "../entity/referral";

export abstract class KycQueryRepository {
  public abstract getMemberGetMemberByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<MemberGetMember[]>;
  public abstract getPlanPreferenceByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<PlanPreference[]>;
  public abstract getReferralByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<Referral[]>;
  public abstract getMgm(kycId: KycId): Promise<MemberGetMember>;
  public abstract getReferral(kycId: KycId): Promise<Referral>;
}
