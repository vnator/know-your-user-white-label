import { Injectable } from "@nestjs/common";
import { SNS } from "aws-sdk";
import { Publisher } from "src/adapter/port/publisher";
import { PublisherConfig } from "src/config/publisher.config";
import { MemberGetMemberDto } from "src/module/kyc/dto/member-get-member.dto";
import { PlanPreferenceDto } from "src/module/kyc/dto/plan-preference.dto";
import { ReferralDto } from "src/module/kyc/dto/referral.dto";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { KycIngestionPublisher } from "./kyc-ingestion-publisher";

export type PublisherMessage =
  | PlanPreferenceDto
  | ReferralDto
  | MemberGetMemberDto;

type TopicArns = {
  [x in EventEnum]?: string;
};

@Injectable()
export class KycPublisher implements Publisher<PublisherMessage> {
  private readonly topicArns: TopicArns;
  constructor(
    private readonly snsClient: SNS,
    private ingestionPublisher: KycIngestionPublisher,
    publisherConfig: PublisherConfig,
  ) {
    this.topicArns = {
      [EventEnum.KYC_MGM_ANSWERED]: publisherConfig.mgmAnswered,
      [EventEnum.KYC_REFERRAL_ANSWERED]: publisherConfig.referralAnswered,
      [EventEnum.KYC_PLAN_PREFERENCE_ANSWERED]:
        publisherConfig.planPreferenceAnswered,
    };
  }

  private getTopic(event: EventEnum): string {
    return this.topicArns[event];
  }

  public async publish(
    event: KycEvent,
    message: PublisherMessage,
  ): Promise<void> {
    const topic = this.getTopic(event.type);
    await this.snsClient
      .publish({
        TopicArn: topic,
        Message: JSON.stringify(message),
      })
      .promise();
    await this.ingestionPublisher.publish(event, message);
  }
}

export const KycPublisherProvider = {
  provide: Publisher,
  useClass: KycPublisher,
};
