import { Injectable } from "@nestjs/common";
import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from "./dto/member-get-member.dto";
import {
  mapDto as mapMgmDto,
  mapEntity as mapMgmEntity,
} from "./map/member-get-member.map";
import {
  mapDto as mapReferralDto,
  mapEntity as mapReferralEntity,
} from "./map/referral.map";
import {
  mapDto as mapPlanPreferenceDto,
  mapEntity as mapPlanPreferenceEntity,
} from "./map/plan-preference.map";
import { KycCommandRepository } from "./port/kyc-command.repository";
import { CreateReferralDto, ReferralDto } from "./dto/referral.dto";
import { EventEmitter2 as EventEmitter } from "@nestjs/event-emitter";
import { MgmAnsweredEvent } from "./event/mgm-answered.event";
import { BaseService } from "src/shared/base-service";
import { ReferralAnsweredEvent } from "./event/referral-answered.event";
import { KycQueryRepository } from "./port/kyc-query.repository";
import {
  CreatePlanPreferenceDto,
  PlanPreferenceDto,
} from "./dto/plan-preference.dto";
import { PlanPreferenceAnsweredEvent } from "./event/plan-preference-answered.event";

type KycAnsweredEvent =
  | MgmAnsweredEvent
  | ReferralAnsweredEvent
  | PlanPreferenceAnsweredEvent;

@Injectable()
export class KycService extends BaseService {
  constructor(
    private readonly kycCommandRepository: KycCommandRepository,
    private readonly kycQueryRepository: KycQueryRepository,
    private readonly eventEmitter: EventEmitter,
  ) {
    super();
  }

  private emitEvent(data: KycAnsweredEvent): void {
    this.eventEmitter.emit(data.type, data);
  }

  async createMgm(mgmDto: CreateMemberGetMemberDto): Promise<void> {
    const kyc = mapMgmDto(mgmDto);
    const result = await this.kycCommandRepository.createMemberGetMember(kyc);
    this.emitEvent(new MgmAnsweredEvent(kyc.id, kyc));
    return result;
  }

  async createPlanPreference(
    planPreferenceDto: CreatePlanPreferenceDto,
  ): Promise<void> {
    const kyc = mapPlanPreferenceDto(planPreferenceDto);
    const result = await this.kycCommandRepository.createPlanPreference(kyc);
    this.emitEvent(new PlanPreferenceAnsweredEvent(kyc.id, kyc));
    return result;
  }

  async createReferral(referralDto: CreateReferralDto): Promise<void> {
    const kyc = mapReferralDto(referralDto);
    const result = await this.kycCommandRepository.createReferral(kyc);
    this.emitEvent(new ReferralAnsweredEvent(kyc.id, kyc));
    return result;
  }

  async getMgmByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<MemberGetMemberDto[]> {
    const kycList = await this.kycQueryRepository
      .getMemberGetMemberByCustomerReferenceId(
        customerReferenceId,
      );
    if (!kycList) return null;
    return kycList.map((kyc) => mapMgmEntity(kyc));
  }

  async getPlanPreferenceByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<PlanPreferenceDto[]> {
    const kycList = await this.kycQueryRepository
      .getPlanPreferenceByCustomerReferenceId(
        customerReferenceId,
      );

    if (!kycList) return null;

    return kycList.map((kyc) => mapPlanPreferenceEntity(kyc));
  }

  async getReferralByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<ReferralDto[]> {
    const kycList = await this.kycQueryRepository
      .getReferralByCustomerReferenceId(
        customerReferenceId,
      );

    if (!kycList) return null;

    return kycList.map((kyc) => mapReferralEntity(kyc));
  }
}
