import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomHttpError } from "src/shared/http-error.error";
import {
  CreateMemberGetMemberDto,
  MemberGetMemberDto,
} from "./dto/member-get-member.dto";
import {
  CreatePlanPreferenceDto,
  PlanPreferenceDto,
} from "./dto/plan-preference.dto";
import { CreateReferralDto, ReferralDto } from "./dto/referral.dto";
import { KycNotFound } from "./error/kyc-not-found.error";
import { KycService } from "./kyc.service";

@Controller({
  path: "kyc",
})
@ApiTags("kyc")
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post("member-get-member")
  async createMgm(@Body() mgmDto: CreateMemberGetMemberDto): Promise<void> {
    await this.kycService.createMgm(mgmDto);
  }

  @Post("plan-preference")
  async createPlanPreference(
    @Body() planPreferenceDto: CreatePlanPreferenceDto,
  ): Promise<void> {
    await this.kycService.createPlanPreference(planPreferenceDto);
  }

  @Post("referral")
  async createReferral(@Body() referralDto: CreateReferralDto): Promise<void> {
    await this.kycService.createReferral(referralDto);
  }

  @Get("member-get-member/customer-reference/:customerReferenceId")
  async getMgmByCustomerReferenceId(
    @Param("customerReferenceId") customerReferenceId: string,
  ): Promise<MemberGetMemberDto[]> {
    const kyc = await this.kycService.getMgmByCustomerReferenceId(
      customerReferenceId,
    );
    if (!kyc) {
      throw new CustomHttpError(new KycNotFound(), HttpStatus.NOT_FOUND);
    }
    return kyc;
  }

  @Get("plan-preference/customer-reference/:customerReferenceId")
  async getPlanPreferenceByCustomerReferenceId(
    @Param("customerReferenceId") customerReferenceId: string,
  ): Promise<PlanPreferenceDto[]> {
    const kyc = await this.kycService.getPlanPreferenceByCustomerReferenceId(
      customerReferenceId,
    );
    if (!kyc) {
      throw new CustomHttpError(new KycNotFound(), HttpStatus.NOT_FOUND);
    }
    return kyc;
  }

  @Get("referral/customer-reference/:customerReferenceId")
  async getReferralByCustomerReferenceId(
    @Param("customerReferenceId") customerReferenceId: string,
  ): Promise<ReferralDto[]> {
    const kyc = await this.kycService.getReferralByCustomerReferenceId(
      customerReferenceId,
    );
    if (!kyc) {
      throw new CustomHttpError(new KycNotFound(), HttpStatus.NOT_FOUND);
    }
    return kyc;
  }
}
