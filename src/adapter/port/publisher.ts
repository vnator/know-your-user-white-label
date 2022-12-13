import { KycEvent } from 'src/module/kyc/event/kyc.event';

export abstract class Publisher<T = any> {
  public abstract publish(event: KycEvent, message: T): Promise<void>;
}
