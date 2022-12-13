import { KycId } from '../entity/kyc';
import { Referral } from '../entity/referral';
import { KycAnsweredEvent } from './kyc-answered.event';
import { EventEnum } from './kyc-event.enum';

export class ReferralAnsweredEvent extends KycAnsweredEvent<Referral> {
  constructor(id: KycId, data: Referral) {
    super(id, data, EventEnum.KYC_REFERRAL_ANSWERED);
  }
}
