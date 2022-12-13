import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { KycAnsweredEvent } from '../event/kyc-answered.event';
import { EventEnum } from '../event/kyc-event.enum';
import { KycProducer } from '../port/kyc.publisher';

@Injectable()
export class KycAnsweredListener {
  constructor(private readonly publisher: KycProducer) {}

  @OnEvent(`${EventEnum.KYC_ANSWERED}.*`)
  async handleKycCreatedEvent(event: KycAnsweredEvent) {
    await this.publisher.produce(event);
  }
}
