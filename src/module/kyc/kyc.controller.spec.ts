import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CustomHttpError } from "src/shared/http-error.error";
import { fake } from "test/mock";
import { instance, mock, verify, when } from "ts-mockito";
import { AppModule } from "../app/app.module";
import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from "./dto/member-get-member.dto";
import {
  CreatePlanPreferenceDto,
  PlanPreferenceDto,
} from "./dto/plan-preference.dto";
import { CreateReferralDto, ReferralDto } from "./dto/referral.dto";
import { KycController } from "./kyc.controller";
import { KycModule } from "./kyc.module";
import { KycService } from "./kyc.service";

describe("KycController", () => {
  let controller: KycController;
  let service: KycService;
  let serviceMock: KycService;

  beforeEach(async () => {
    serviceMock = mock(KycService);
    service = instance(serviceMock);
    const module: TestingModule = await Test.createTestingModule({
      imports: [KycModule, AppModule],
    })
      .overrideProvider(KycService)
      .useValue(service)
      .compile();

    controller = module.get<KycController>(KycController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("MGM KYC", () => {
    let memberGetMemberDto: CreateMemberGetMemberDto;
    beforeEach(() => {
      memberGetMemberDto = fake(CreateMemberGetMemberDto);
    });

    it("should create kyc", async () => {
      await controller.createMgm(memberGetMemberDto);
      verify(serviceMock.createMgm(memberGetMemberDto)).once();
    });

    it("should get kyc by customer reference id", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(MemberGetMemberDto);
      when(
        serviceMock.getMgmByCustomerReferenceId(customerReferenceId),
      ).thenResolve([kyc]);
      const result = await controller.getMgmByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        serviceMock.getMgmByCustomerReferenceId(customerReferenceId),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    describe("Errors", () => {
      it("should throw 404 error", async () => {
        const customerReferenceId = faker.datatype.uuid();
        let error: CustomHttpError;
        await expect(() =>
          controller
            .getMgmByCustomerReferenceId(customerReferenceId)
            .catch((err) => {
              error = err;
              throw err;
            })
        ).rejects.toThrow(/not found/);
        verify(
          serviceMock.getMgmByCustomerReferenceId(customerReferenceId),
        ).once();
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe("Plan preference KYC", () => {
    let planPreferenceDto: CreatePlanPreferenceDto;
    beforeEach(() => {
      planPreferenceDto = fake(PlanPreferenceDto);
    });

    it("should create kyc", async () => {
      await controller.createPlanPreference(planPreferenceDto);
      verify(serviceMock.createPlanPreference(planPreferenceDto)).once();
    });

    it("should get kyc by customer reference id", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(PlanPreferenceDto);
      when(
        serviceMock.getPlanPreferenceByCustomerReferenceId(customerReferenceId),
      ).thenResolve([kyc]);
      const result = await controller.getPlanPreferenceByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        serviceMock.getPlanPreferenceByCustomerReferenceId(customerReferenceId),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    describe("Errors", () => {
      it("should throw 404 error", async () => {
        const customerReferenceId = faker.datatype.uuid();
        let error: CustomHttpError;
        await expect(() =>
          controller
            .getPlanPreferenceByCustomerReferenceId(customerReferenceId)
            .catch((err) => {
              error = err;
              throw err;
            })
        ).rejects.toThrow(/not found/);
        verify(
          serviceMock.getPlanPreferenceByCustomerReferenceId(
            customerReferenceId,
          ),
        ).once();
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe("Referral KYC", () => {
    let referralDto: CreateReferralDto;
    beforeEach(() => {
      referralDto = fake(ReferralDto);
    });

    it("should create kyc", async () => {
      await controller.createReferral(referralDto);
      verify(serviceMock.createReferral(referralDto)).once();
    });

    it("should get kyc by customerReferenceId", async () => {
      const customerReferenceId = faker.datatype.uuid();
      const kyc = fake(ReferralDto);
      when(
        serviceMock.getReferralByCustomerReferenceId(customerReferenceId),
      ).thenResolve([kyc]);
      const result = await controller.getReferralByCustomerReferenceId(
        customerReferenceId,
      );
      verify(
        serviceMock.getReferralByCustomerReferenceId(customerReferenceId),
      ).once();
      expect(result[0].id).toBe(kyc.id);
    });

    describe("Errors", () => {
      it("should throw 404 error", async () => {
        const customerReferenceId = faker.datatype.uuid();
        let error: CustomHttpError;
        await expect(() =>
          controller
            .getReferralByCustomerReferenceId(customerReferenceId)
            .catch((err) => {
              error = err;
              throw err;
            })
        ).rejects.toThrow(/not found/);
        verify(
          serviceMock.getReferralByCustomerReferenceId(customerReferenceId),
        ).once();
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
