import { Kyc } from './kyc';
import { KycChoices } from './kyc-choices';

export enum PlanPreferenceChoiceEnum {
  shortTermPlan = 'shortTermPlan',
  longTermPlan = 'longTermPlan',
}

class PlanPreferenceChoice {
  key: PlanPreferenceChoiceEnum;
  value: boolean;
}

export class PlanPreference extends KycChoices<PlanPreferenceChoice> {
  static readonly kind = 'PLAN_PREFERENCE';
  public readonly kind = PlanPreference.kind;
  constructor(
    public readonly customerReferenceId: string,
    public readonly choices: PlanPreferenceChoice[],
    public readonly id = Kyc.generateId(),
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {
    super();
  }
}
