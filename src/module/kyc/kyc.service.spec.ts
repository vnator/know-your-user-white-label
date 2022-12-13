import { faker } from "@faker-js/faker";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { fake } from "test/mock";
import {
  anyOfClass,
  anyString,
  instance,
  mock,
  verify,
  when,
} from "ts-mockito";
import { CreateMemberGetMemberDto } from "./dto/member-get-member.dto";
import { PlanPreferenceDto } from "./dto/plan-preference.dto";
import { CreateReferralDto } from "./dto/referral.dto";
import { MemberGetMember } from "./entity/member-get-member";
import { PlanPreference } from "./entity/plan-preference";
import { Referral } from "./entity/referral";
import { MgmAnsweredEvent } from "./event/mgm-answered.event";
import { PlanPreferenceAnsweredEvent } from "./event/plan-preference-answered.event";
import { ReferralAnsweredEvent } from "./event/referral-answered.event";
import { KycService } from "./kyc.service";
import { KycCommandRepository } from "./port/kyc-command.repository";
import { KycQueryRepository } from "./port/kyc-query.repository";

describe("KycService", () => {
  let service: KycService;
  let commandRepositoryMock: KycCommandRepository;
  let commandRepository: KycCommandRepository;
  let queryRepositoryMock: KycQueryRepository;
  let queryRepository: KycQueryRepository;
  let eventEmitterMock: EventEmitter2;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    commandRepositoryMock = mock<KycCommandRepository>();
    queryRepositoryMock = mock<KycQueryRepository>();
    eventEmitterMock = mock(EventEmitter2);
    eventEmitter = instance(eventEmitterMock);
    commandRepository = instance(commandRepositoryMock);
    queryRepository = instance(queryRepositoryMock);
    service = new KycService(commandRepository, queryRepository, eventEmitter);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("member get member", () => {
    let memberGetMemberDto: CreateMemberGetMemberDto;
    beforeEach(() => {
      memberGetMemberDto = fake(CreateMemberGetMemberDto);
    });

    it("should create kyc", async () => {
      await service.createMgm(memberGetMemberDto);
      verify(
        commandRepositoryMock.createMemberGetMember(
          anyOfClass(MemberGetMember),
        ),
      ).once();
      verify(
        eventEmitterMock.emit(anyString(), anyOfClass(MgmAnsweredEvent)),
      ).once();
      verify(
        eventEmitterMock.emit(anyString(), anyOfClass(MgmAnsweredEvent)),
      ).calledAfter(
        commandRepositoryMock.createMemberGetMember(
          anyOfClass(MemberGetMember),
        ),
      );
    });

    it("should get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(MemberGetMember);
      when(
        queryRepositoryMock.getMemberGetMemberByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve([kyc]);
      const result = await service.getMgmByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getMemberGetMemberByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    it("should return null on get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      when(
        queryRepositoryMock.getMemberGetMemberByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve(null);
      const result = await service.getMgmByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getMemberGetMemberByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result).toBeNull();
    });
  });

  describe("plan preference", () => {
    let planPreferenceDto: PlanPreferenceDto;
    beforeEach(() => {
      planPreferenceDto = fake(PlanPreferenceDto);
    });

    it("should create kyc", async () => {
      await service.createPlanPreference(planPreferenceDto);
      verify(
        commandRepositoryMock.createPlanPreference(anyOfClass(PlanPreference)),
      ).once();
      verify(
        eventEmitterMock.emit(
          anyString(),
          anyOfClass(PlanPreferenceAnsweredEvent),
        ),
      ).once();
      verify(
        eventEmitterMock.emit(
          anyString(),
          anyOfClass(PlanPreferenceAnsweredEvent),
        ),
      ).calledAfter(
        commandRepositoryMock.createPlanPreference(anyOfClass(PlanPreference)),
      );
    });

    it("should get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(PlanPreference);
      when(
        queryRepositoryMock.getPlanPreferenceByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve([kyc]);
      const result = await service.getPlanPreferenceByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getPlanPreferenceByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    it("should return null on get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      when(
        queryRepositoryMock.getPlanPreferenceByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve(null);
      const result = await service.getPlanPreferenceByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getPlanPreferenceByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result).toBeNull();
    });
  });

  describe("referral", () => {
    let referralDto: CreateReferralDto;
    beforeEach(() => {
      referralDto = fake(CreateReferralDto);
    });

    it("should create kyc", async () => {
      await service.createReferral(referralDto);
      verify(commandRepositoryMock.createReferral(anyOfClass(Referral))).once();
      verify(
        eventEmitterMock.emit(anyString(), anyOfClass(ReferralAnsweredEvent)),
      ).once();
      verify(
        eventEmitterMock.emit(anyString(), anyOfClass(ReferralAnsweredEvent)),
      ).calledAfter(commandRepositoryMock.createReferral(anyOfClass(Referral)));
    });

    it("should get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(Referral);
      when(
        queryRepositoryMock.getReferralByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve([kyc]);
      const result = await service.getReferralByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getReferralByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    it("should return null on get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      when(
        queryRepositoryMock.getReferralByCustomerReferenceId(
          customerReferenceId,
        ),
      ).thenResolve(null);
      const result = await service.getReferralByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        queryRepositoryMock.getReferralByCustomerReferenceId(
          customerReferenceId,
        ),
      ).once();
      expect(result).toBeNull();
    });
  });
});
