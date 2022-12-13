import { faker } from "@faker-js/faker";
import { Kyc, KycId } from "src/module/kyc/entity/kyc";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { memberGetMemberFaker } from "./member-get-member.mock";
import { referralFaker } from "./referral.mock";

export const randomKyc = () =>
  faker.helpers.arrayElement<Kyc>([memberGetMemberFaker(), referralFaker()]);

export const randomKycId = (): KycId => faker.datatype.uuid();
export const randomKycEvent = () =>
  faker.helpers.arrayElement<EventEnum>(Object.values(EventEnum));
export const kycEventFaker = () =>
  new KycEvent(randomKycId(), randomKyc(), randomKycEvent());
