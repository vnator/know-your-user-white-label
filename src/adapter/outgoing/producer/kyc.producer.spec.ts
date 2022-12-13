import MockDate from "mockdate";
import { Publisher } from "src/adapter/port/publisher";
import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { PlanPreference } from "src/module/kyc/entity/plan-preference";
import { Referral } from "src/module/kyc/entity/referral";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { fake } from "test/mock";
import { anything, capture, instance, mock, verify } from "ts-mockito";
import { KycProducer } from "./kyc.producer";

describe("KycPublisher", () => {
  let producer: KycProducer;
  let publisher: Publisher;
  let publisherMock: Publisher;
  let event: KycEvent;

  beforeEach(() => {
    event = fake(KycEvent);
    publisherMock = mock<Publisher>();
    publisher = instance(publisherMock);
    producer = new KycProducer(publisher);
    MockDate.set(new Date());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("should publish mgm kyc answered message", async () => {
    const mgm = fake(MemberGetMember);
    event = {
      type: EventEnum.KYC_MGM_ANSWERED,
      id: mgm.id,
      data: mgm,
    };
    await producer.produce(event);
    verify(publisherMock.publish(event, anything())).once();
    const [, message] = capture(publisherMock.publish).last();
    expect(message).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        customerReferenceId: expect.any(String),
        referenceCode: expect.any(String),
        codeKind: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });
  it("should publish plan preference kyc answered message", async () => {
    const planPreference = fake(PlanPreference);
    event = {
      type: EventEnum.KYC_PLAN_PREFERENCE_ANSWERED,
      id: planPreference.id,
      data: planPreference,
    };
    await producer.produce(event);
    verify(publisherMock.publish(event, anything())).once();
    const [, message] = capture(publisherMock.publish).last();
    expect(message).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        customerReferenceId: expect.any(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            key: expect.any(String),
            value: expect.any(Boolean),
          }),
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it("should publish referral kyc answered message", async () => {
    const referral = fake(Referral);
    event = {
      type: EventEnum.KYC_REFERRAL_ANSWERED,
      id: referral.id,
      data: referral,
    };
    await producer.produce(event);
    verify(publisherMock.publish(event, anything())).once();
    const [, message] = capture(publisherMock.publish).last();
    expect(message).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        customerReferenceId: expect.any(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            key: expect.any(String),
            value: expect.any(Boolean),
          }),
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });
});
