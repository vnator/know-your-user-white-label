import { Kyc, KycId } from "src/module/kyc/entity/kyc";
import { KycChoices } from "src/module/kyc/entity/kyc-choices";
import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { PlanPreference } from "src/module/kyc/entity/plan-preference";

export class KycPayload {
  static getPayload(kyc: Kyc): KycPayload {
    const kycPayload = new KycPayload();
    let data;
    if (kyc instanceof MemberGetMember) {
      const mgm = kyc as MemberGetMember;
      data = {
        referenceCode: mgm.referenceCode,
        codeKind: mgm.codeKind.value,
      };
    } else if (kyc instanceof KycChoices) {
      const choice = kyc as PlanPreference;
      data = choice.choices;
    }
    Object.assign(kycPayload, {
      id: kyc.id,
      customerReferenceId: kyc.customerReferenceId,
      kind: kyc.kind,
      createdAt: kyc.createdAt.toISOString(),
      updatedAt: kyc.updatedAt.toISOString(),
      data,
    });
    return kycPayload;
  }

  static fromData(data: any) {
    const kycPayload = new KycPayload();
    Object.assign(kycPayload, data);
    return kycPayload;
  }

  id: KycId;
  customerReferenceId: string;
  kind: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}
