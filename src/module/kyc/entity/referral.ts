import { Kyc } from "./kyc";
import { KycChoices } from "./kyc-choices";

export enum ReferralChoiceEnum {
  isLinkedin = "isLinkedin",
  isGithub = "isGithub",
  isCustomerReference = "isCustomerReference",
  isFromSocialNetwork = "isFromSocialNetwork",
  isFromAnotherResource = "isFromAnotherResource",
}

class ReferralChoice {
  key: ReferralChoiceEnum;
  value: boolean;
}

export class Referral extends KycChoices<ReferralChoice> {
  static readonly kind = "REFERRAL";
  public readonly kind = Referral.kind;
  constructor(
    readonly customerReferenceId: string,
    public readonly choices: ReferralChoice[],
    readonly id = Kyc.generateId(),
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {
    super();
  }
}
