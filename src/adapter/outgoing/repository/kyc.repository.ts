import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { KycPayload } from "src/adapter/outgoing/repository/entity/kyc-payload";
import { DatabaseConfig } from "src/config/database.config";
import { Kyc } from "src/module/kyc/entity/kyc";
import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { MgmCodeKindEnum } from "src/module/kyc/entity/mgm-code-kind-enum";
import { PlanPreference } from "src/module/kyc/entity/plan-preference";
import { Referral } from "src/module/kyc/entity/referral";
import { KycCommandRepository } from "src/module/kyc/port/kyc-command.repository";
import { KycQueryRepository } from "src/module/kyc/port/kyc-query.repository";
import DynamoDatabase from "../database/dynamo-db.database";

@Injectable()
export class KycRepository implements KycCommandRepository, KycQueryRepository {
  private table: string;
  constructor(
    private readonly database: DynamoDatabase,
    private readonly logger: Logger,
    databaseConfig: DatabaseConfig,
  ) {
    this.table = databaseConfig.table;
  }

  public createMemberGetMember(mgm: MemberGetMember): Promise<void> {
    return this.create(mgm);
  }
  public createPlanPreference(planPreference: PlanPreference): Promise<void> {
    return this.create(planPreference);
  }
  public createReferral(referral: Referral): Promise<void> {
    return this.create(referral);
  }

  public async getMgm(kycId: string): Promise<MemberGetMember> {
    const { kind } = MemberGetMember;
    const kycData = await this.database.get(this.table, kycId);
    const payload = KycPayload.fromData(kycData);
    if (payload.kind !== kind) {
      this.logger.error(`${kind} not found for ${kycId}. return:`, payload);
      this.logger.error(payload, "payload");
      return null;
    }
    return new MemberGetMember(
      payload.customerReferenceId,
      payload.data.referenceCode,
      MgmCodeKindEnum.getFromValue(payload.data.codeKind),
      payload.id,
      new Date(payload.createdAt),
      new Date(payload.updatedAt),
    );
  }

  public async getReferral(kycId: string): Promise<Referral> {
    const { kind } = Referral;
    const kycData = await this.database.get(this.table, kycId);
    const payload = KycPayload.fromData(kycData);
    if (payload.kind !== kind) {
      this.logger.error(`${kind} not found for ${kycId}. return:`, payload);
      this.logger.error(payload, "payload");
      return null;
    }
    return new Referral(
      payload.customerReferenceId,
      payload.data,
      payload.id,
      new Date(payload.createdAt),
      new Date(payload.updatedAt),
    );
  }

  private async create(kyc: Kyc): Promise<void> {
    const kycPayload = KycPayload.getPayload(kyc);
    delete kycPayload.id;
    const keys = { id: kyc.id };
    await this.database.upsert(this.table, keys, kycPayload);
  }

  public async getMemberGetMemberByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<MemberGetMember[]> {
    const { kind } = MemberGetMember;
    const kycList = await this.database.query(
      this.table,
      "CustomerIndex",
      { customerReferenceId },
      { kind },
    );
    if (!kycList || kycList.length === 0) {
      this.logger.error(
        `${kind} not found for customer ${customerReferenceId}.`,
      );
      return null;
    }
    return kycList.map((data) => {
      const payload = KycPayload.fromData(data);
      return new MemberGetMember(
        payload.customerReferenceId,
        payload.data.referenceCode,
        MgmCodeKindEnum.getFromValue(payload.data.codeKind),
        payload.id,
        new Date(payload.createdAt),
        new Date(payload.updatedAt),
      );
    });
  }

  public async getPlanPreferenceByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<PlanPreference[]> {
    const { kind } = PlanPreference;
    const kycList = await this.database.query(
      this.table,
      "CustomerIndex",
      { customerReferenceId },
      { kind },
    );
    if (!kycList || kycList.length === 0) {
      this.logger.error(
        `${kind} not found for customer ${customerReferenceId}.`,
      );
      return null;
    }
    return kycList.map((data) => {
      const payload = KycPayload.fromData(data);
      return new PlanPreference(
        payload.customerReferenceId,
        payload.data,
        payload.id,
        new Date(payload.createdAt),
        new Date(payload.updatedAt),
      );
    });
  }

  public async getReferralByCustomerReferenceId(
    customerReferenceId: string,
  ): Promise<Referral[]> {
    const { kind } = Referral;
    const kycList = await this.database.query(
      this.table,
      "CustomerIndex",
      { customerReferenceId },
      { kind },
    );
    if (!kycList || kycList.length === 0) {
      this.logger.error(
        `${kind} not found for customer ${customerReferenceId}.`,
      );
      return null;
    }
    return kycList.map((data) => {
      const payload = KycPayload.fromData(data);
      return new Referral(
        payload.customerReferenceId,
        payload.data,
        payload.id,
        new Date(payload.createdAt),
        new Date(payload.updatedAt),
      );
    });
  }
}

export const KycCommandRepositoryProvider = {
  provide: KycCommandRepository,
  useClass: KycRepository,
};

export const KycQueryRepositoryProvider = {
  provide: KycQueryRepository,
  useClass: KycRepository,
};
