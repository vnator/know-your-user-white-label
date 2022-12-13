import { Kyc } from '../entity/kyc';
import { KycEvent } from './kyc.event';

export class KycAnsweredEvent<T extends Kyc = Kyc> extends KycEvent<T> {}
