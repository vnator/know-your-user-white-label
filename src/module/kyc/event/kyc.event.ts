import { Kyc, KycId } from '../entity/kyc';
import { EventEnum } from './kyc-event.enum';

export class KycEvent<T extends Kyc = Kyc> {
  constructor(
    public readonly id: KycId,
    public readonly data: T,
    public readonly type: EventEnum,
  ) {}
}
