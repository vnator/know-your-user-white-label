import { Injectable } from "@nestjs/common";
import { Publisher } from "src/adapter/port/publisher";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { MgmAnsweredEvent } from "src/module/kyc/event/mgm-answered.event";
import { PlanPreferenceAnsweredEvent } from "src/module/kyc/event/plan-preference-answered.event";
import { ReferralAnsweredEvent } from "src/module/kyc/event/referral-answered.event";
import { mapEntity as planPreferenceMapEntity } from "src/module/kyc/map/plan-preference.map";
import { mapEntity as mgmMapEntity } from "src/module/kyc/map/member-get-member.map";
import { mapEntity as referralMapEntity } from "src/module/kyc/map/referral.map";
import { KycProducer as IKycProducer } from "src/module/kyc/port/kyc.publisher";

@Injectable()
export class KycProducer implements IKycProducer {
  constructor(private readonly publisher: Publisher) {}

  private async publish(event: KycEvent, message: any): Promise<void> {
    this.publisher.publish(event, message);
  }

  async produceMGM(event: MgmAnsweredEvent): Promise<void> {
    const kyc = event.data;
    const payload = mgmMapEntity(kyc);
    await this.publish(event, payload);
  }

  async producePlanPreference(event: PlanPreferenceAnsweredEvent) {
    const kyc = event.data;
    const payload = planPreferenceMapEntity(kyc);
    await this.publish(event, payload);
  }

  async produceReferral(event: ReferralAnsweredEvent) {
    const kyc = event.data;
    const payload = referralMapEntity(kyc);
    await this.publish(event, payload);
  }

  async produce(event: KycEvent): Promise<void> {
    const dict = {
      [EventEnum.KYC_MGM_ANSWERED]: () =>
        this.produceMGM(event as MgmAnsweredEvent),
      [EventEnum.KYC_PLAN_PREFERENCE_ANSWERED]: () =>
        this.producePlanPreference(event as PlanPreferenceAnsweredEvent),
      [EventEnum.KYC_REFERRAL_ANSWERED]: () =>
        this.produceReferral(event as ReferralAnsweredEvent),
    };
    const producer = dict[event.type];
    if (producer) {
      await producer();
    }
  }
}

export const KycProducerProvider = {
  provide: IKycProducer,
  useClass: KycProducer,
};
