import { KycEvent } from '../event/kyc.event';

export abstract class KycProducer {
  abstract produce(data: KycEvent): Promise<void>;
}
