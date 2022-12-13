import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from "src/module/kyc/dto/member-get-member.dto";
import {
  CreatePlanPreferenceDto,
  PlanPreferenceDto,
} from "src/module/kyc/dto/plan-preference.dto";
import {
  CreateReferralDto,
  ReferralDto,
} from "src/module/kyc/dto/referral.dto";
import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { PlanPreference } from "src/module/kyc/entity/plan-preference";
import { Referral } from "src/module/kyc/entity/referral";
import { KycAnsweredEvent } from "src/module/kyc/event/kyc-answered.event";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { kycCreatedEventFaker } from "./kyc-created.event";
import { kycEventFaker } from "./kyc.event.mock";
import {
  createMemberGetMemberDtoFaker,
  memberGetMemberDtoFaker,
} from "./member-get-member.dto.mock";
import { memberGetMemberFaker } from "./member-get-member.mock";
import {
  createPlanPreferenceDtoFaker,
  planPreferenceDtoFaker,
} from "./plan-preference.dto.mock";
import { planPreferenceFaker } from "./plan-preference.mock";
import { createReferralDtoFaker, referralDtoFaker } from "./referral.dto.mock";
import { referralFaker } from "./referral.mock";

type FakerDict = {
  [key: string]: () => unknown;
};
const fakers: FakerDict = {};
export const addFaker = <T>(ClassType: new (...args) => T, fnFake: () => T) => {
  fakers[ClassType.name] = fnFake;
};

addFaker(CreateMemberGetMemberDto, createMemberGetMemberDtoFaker);
addFaker(MemberGetMemberDto, memberGetMemberDtoFaker);
addFaker(MemberGetMember, memberGetMemberFaker);
addFaker(CreateReferralDto, createReferralDtoFaker);
addFaker(ReferralDto, referralDtoFaker);
addFaker(Referral, referralFaker);
addFaker(KycEvent, kycEventFaker);
addFaker(KycAnsweredEvent, kycCreatedEventFaker);
addFaker(CreatePlanPreferenceDto, createPlanPreferenceDtoFaker);
addFaker(PlanPreferenceDto, planPreferenceDtoFaker);
addFaker(PlanPreference, planPreferenceFaker);

export const fake = <T>(ClassType: new (...args) => T) => {
  const fakeFn = fakers[ClassType.name];
  if (!fakeFn) throw new Error(`${ClassType.name} has no fake function`);
  return fakeFn() as T;
};
