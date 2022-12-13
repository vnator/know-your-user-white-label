import { faker } from "@faker-js/faker";
import { AWSError, Request } from "aws-sdk";
import SNS from "aws-sdk/clients/sns";
import { PublisherConfig } from "src/config/publisher.config";
import { MemberGetMemberDto } from "src/module/kyc/dto/member-get-member.dto";
import { ReferralDto } from "src/module/kyc/dto/referral.dto";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { fake } from "test/mock";
import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { KycIngestionPublisher } from "./kyc-ingestion-publisher";
import { KycPublisher } from "./kyc-publisher";

describe("KycPublisher", () => {
  let publisher: KycPublisher;
  let snsClient: SNS;
  let snsClientMock: SNS;
  let resultMock: Request<any, AWSError>;
  let result: Request<any, AWSError>;
  let ingestionPublisherMock: KycIngestionPublisher;
  let ingestionClient: KycIngestionPublisher;
  let ingestionEndpoint: string;
  let ingestionApiKey: string;
  let event: KycEvent;
  const mgmAnsweredTopic = "mgm-answered";
  const referralAnsweredTopic = "referral-answered";
  beforeEach(() => {
    event = fake(KycEvent);
    ingestionEndpoint = faker.internet.url();
    ingestionApiKey = faker.internet.password();
    resultMock = mock<Request<any, AWSError>>();
    result = instance(resultMock);
    snsClientMock = mock(SNS);
    when(snsClientMock.publish(anything())).thenReturn(result);
    snsClient = instance(snsClientMock);
    ingestionPublisherMock = mock(KycIngestionPublisher);
    ingestionClient = instance(ingestionPublisherMock);
    publisher = new KycPublisher(snsClient, ingestionClient, {
      ingestionEndpoint,
      mgmAnswered: mgmAnsweredTopic,
      referralAnswered: referralAnsweredTopic,
      ingestionApiKey,
    } as PublisherConfig);
  });

  it("should publish mgm message on sns", async () => {
    event = { type: EventEnum.KYC_MGM_ANSWERED, id: "id", data: null };
    const topic = mgmAnsweredTopic;
    const message = fake(MemberGetMemberDto);
    await publisher.publish(event, message);
    verify(
      snsClientMock.publish(
        deepEqual({
          TopicArn: topic,
          Message: JSON.stringify(message),
        }),
      ),
    ).once();
    verify(ingestionPublisherMock.publish(event, message)).once();
  });

  it("should publish referral message on sns", async () => {
    event = { type: EventEnum.KYC_REFERRAL_ANSWERED, id: "id", data: null };
    const topic = referralAnsweredTopic;
    const message = fake(ReferralDto);
    await publisher.publish(event, message);
    verify(
      snsClientMock.publish(
        deepEqual({
          TopicArn: topic,
          Message: JSON.stringify(message),
        }),
      ),
    ).once();
    verify(ingestionPublisherMock.publish(event, message)).once();
  });
});
