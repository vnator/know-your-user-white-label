import { PlanPreference } from '../entity/plan-preference';
import { KycId } from '../entity/kyc';
import { KycAnsweredEvent } from './kyc-answered.event';
import { EventEnum } from './kyc-event.enum';

export class PlanPreferenceAnsweredEvent extends KycAnsweredEvent<PlanPreference> {
  constructor(id: KycId, data: PlanPreference) {
    super(id, data, EventEnum.KYC_PLAN_PREFERENCE_ANSWERED);
  }
}
