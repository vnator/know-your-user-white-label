import { fake } from 'test/mock';
import { instance, mock, verify } from 'ts-mockito';
import { KycAnsweredEvent } from '../event/kyc-answered.event';
import { KycProducer } from '../port/kyc.publisher';
import { KycAnsweredListener } from './kyc-answered.listener';

describe('KycAnsweredListener', () => {
  let listener: KycAnsweredListener;
  let publisher: KycProducer;
  let publisherMock: KycProducer;
  let kycCreatedEvent: KycAnsweredEvent;

  beforeEach(() => {
    kycCreatedEvent = fake(KycAnsweredEvent);
    publisherMock = mock<KycProducer>();
    publisher = instance(publisherMock);
    listener = new KycAnsweredListener(publisher);
  });

  it('should publish created kyc', async () => {
    await listener.handleKycCreatedEvent(kycCreatedEvent);
    verify(publisherMock.produce(kycCreatedEvent)).once();
  });
});
