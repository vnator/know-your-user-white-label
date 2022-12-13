import { Logger } from "nestjs-pino";
import { KycPayload } from "src/adapter/outgoing/repository/entity/kyc-payload";
import { DatabaseConfig } from "src/config/database.config";
import { Kyc } from "src/module/kyc/entity/kyc";
import { MemberGetMember } from "src/module/kyc/entity/member-get-member";
import { PlanPreference } from "src/module/kyc/entity/plan-preference";
import { Referral } from "src/module/kyc/entity/referral";
import { fake } from "test/mock";
import {
  anyOfClass,
  anyString,
  anything,
  deepEqual,
  instance,
  mock,
  verify,
  when,
} from "ts-mockito";
import DynamoDatabase from "../database/dynamo-db.database";
import { KycRepository } from "./kyc.repository";

describe("KycDynamoRepository", () => {
  let repository: KycRepository;
  let dynamoDatabase: DynamoDatabase;
  let dynamoDatabaseMock: DynamoDatabase;
  let kyc: Kyc;
  let payload: KycPayload;
  let loggerMock: Logger;
  let logger: Logger;
  const table = "table";

  beforeEach(async () => {
    dynamoDatabaseMock = mock(DynamoDatabase);
    dynamoDatabase = instance(dynamoDatabaseMock);
    loggerMock = mock(Logger);
    logger = instance(loggerMock);
    repository = new KycRepository(dynamoDatabase, logger, {
      table,
    } as DatabaseConfig);
  });

  it("should create mgm kyc", async () => {
    const kyc = fake(MemberGetMember);
    await repository.createMemberGetMember(kyc);
    verify(
      dynamoDatabaseMock.upsert(
        table,
        deepEqual({ id: kyc.id }),
        anyOfClass(KycPayload),
      ),
    ).once();
  });

  it("should create plan preference kyc", async () => {
    const kyc = fake(PlanPreference);
    await repository.createPlanPreference(kyc);
    verify(
      dynamoDatabaseMock.upsert(
        table,
        deepEqual({ id: kyc.id }),
        anyOfClass(KycPayload),
      ),
    ).once();
  });

  it("should create referral kyc", async () => {
    const kyc = fake(Referral);
    await repository.createReferral(kyc);
    verify(
      dynamoDatabaseMock.upsert(
        table,
        deepEqual({ id: kyc.id }),
        anyOfClass(KycPayload),
      ),
    ).once();
  });

  it("should get mgm kyc payload", async () => {
    kyc = fake(MemberGetMember);
    payload = KycPayload.getPayload(kyc);
    when(dynamoDatabaseMock.get(table, anyString())).thenResolve(payload);
    const kycId = payload.id;
    const result = await repository.getMgm(kycId);
    verify(dynamoDatabaseMock.get(table, kycId)).once();
    expect(result).toEqual(kyc);
  });

  it("should get referral kyc payload", async () => {
    kyc = fake(Referral);
    payload = KycPayload.getPayload(kyc);
    when(dynamoDatabaseMock.get(table, anyString())).thenResolve(payload);
    const kycId = payload.id;
    const result = await repository.getReferral(kycId);
    verify(dynamoDatabaseMock.get(table, kycId)).once();
    expect(result).toEqual(kyc);
  });

  it("should get null on get referral kyc with id from another kind", async () => {
    kyc = fake(MemberGetMember);
    payload = KycPayload.getPayload(kyc);
    when(dynamoDatabaseMock.get(table, anyString())).thenResolve(payload);
    const kycId = payload.id;
    const result = await repository.getReferral(kycId);
    verify(dynamoDatabaseMock.get(table, kycId)).once();
    expect(result).toBeNull();
  });

  it("should get mgm kyc by customer reference id", async () => {
    kyc = fake(MemberGetMember);
    payload = KycPayload.getPayload(kyc);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([payload]);
    const result = await repository.getMemberGetMemberByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result[0]).toEqual(kyc);
  });

  it("should return null when mgm kyc by customer reference id not found", async () => {
    kyc = fake(MemberGetMember);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([]);
    const result = await repository.getMemberGetMemberByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result).toBeNull();
  });

  it("should get plan preference kyc by customer reference id", async () => {
    kyc = fake(PlanPreference);
    payload = KycPayload.getPayload(kyc);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([payload]);
    const result = await repository.getPlanPreferenceByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result[0]).toEqual(kyc);
  });

  it("should return null when plan reference kyc by customer reference id not found", async () => {
    kyc = fake(PlanPreference);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([]);
    const result = await repository.getPlanPreferenceByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result).toBeNull();
  });

  it("should get referral kyc by customer reference id", async () => {
    kyc = fake(Referral);
    payload = KycPayload.getPayload(kyc);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([payload]);
    const result = await repository.getReferralByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result[0]).toEqual(kyc);
  });

  it("should return null when referral kyc by customer reference id not found", async () => {
    kyc = fake(Referral);
    const { customerReferenceId } = kyc;
    const conditions = { customerReferenceId };
    const filters = { kind: kyc.kind };
    when(
      dynamoDatabaseMock.query(table, anyString(), anything(), anything()),
    ).thenResolve([]);
    const result = await repository.getReferralByCustomerReferenceId(
      customerReferenceId,
    );
    verify(
      dynamoDatabaseMock.query(
        table,
        anyString(),
        deepEqual(conditions),
        deepEqual(filters),
      ),
    ).once();
    expect(result).toBeNull();
  });
});
