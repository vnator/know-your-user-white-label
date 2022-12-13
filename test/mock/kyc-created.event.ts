import { KycAnsweredEvent } from 'src/module/kyc/event/kyc-answered.event';
import { randomKycId, randomKycEvent, randomKyc } from './kyc.event.mock';

export const kycCreatedEventFaker = () =>
  new KycAnsweredEvent(randomKycId(), randomKyc(), randomKycEvent());
