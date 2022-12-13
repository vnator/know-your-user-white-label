import { faker } from "@faker-js/faker";
import MockDate from "mockdate";
import { HttpClient } from "src/adapter/port/http-client";
import { PublisherConfig } from "src/config/publisher.config";
import { MemberGetMemberDto } from "src/module/kyc/dto/member-get-member.dto";
import { PlanPreferenceDto } from "src/module/kyc/dto/plan-preference.dto";
import { ReferralDto } from "src/module/kyc/dto/referral.dto";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";
import { fake } from "test/mock";
import { deepEqual, instance, mock, verify } from "ts-mockito";
import { KycIngestionPublisher } from "./kyc-ingestion-publisher";

describe("KycIngestionPublisher", () => {
  let publisher: KycIngestionPublisher;
  let httpClientMock: HttpClient;
  let httpClient: HttpClient;
  let ingestionEndpoint: string;
  let ingestionApiKey: string;
  let event: KycEvent;
  let now: Date;
  let url: string;
  let headers: any;
  beforeEach(() => {
    event = fake(KycEvent);
    ingestionEndpoint = faker.internet.url();
    ingestionApiKey = faker.internet.password();
    httpClientMock = mock<HttpClient>();
    httpClient = instance(httpClientMock);
    publisher = new KycIngestionPublisher(httpClient, {
      ingestionEndpoint,
      ingestionApiKey,
    } as PublisherConfig);
    now = new Date();
    MockDate.set(now);
    headers = {
      "x-api-key": ingestionApiKey,
      "Content-Type": "application/json",
    };
    url = `${ingestionEndpoint}/analytics/ingestion/passive/kyc/`;
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("should send mgm to ingestion endpoint", async () => {
    event = { type: EventEnum.KYC_MGM_ANSWERED, id: "id", data: null };
    const message = fake(MemberGetMemberDto);
    const body = {
      data: message,
      metadata: {
        timestamp: now.toISOString(),
        "record-type": "data",
        operation: "insert",
        "partition-key-type": "schema-table",
        "schema-name": "kyc",
        "table-name": "know-your-customer-mgm",
        "transaction-id": "",
      },
    };
    await publisher.publish(event, message);
    verify(
      httpClientMock.post(url, deepEqual(body), deepEqual({ headers })),
    ).once();
  });

  it("should send plan preference to ingestion endpoint", async () => {
    event = {
      type: EventEnum.KYC_PLAN_PREFERENCE_ANSWERED,
      id: "id",
      data: null,
    };
    const message = fake(PlanPreferenceDto);
    const body = {
      data: message,
      metadata: {
        timestamp: now.toISOString(),
        "record-type": "data",
        operation: "insert",
        "partition-key-type": "schema-table",
        "schema-name": "kyc",
        "table-name": "know-your-customer-plan-preference",
        "transaction-id": "",
      },
    };
    await publisher.publish(event, message);
    verify(
      httpClientMock.post(url, deepEqual(body), deepEqual({ headers })),
    ).once();
  });

  it("should send referral to ingestion endpoint", async () => {
    event = { type: EventEnum.KYC_REFERRAL_ANSWERED, id: "id", data: null };
    const message = fake(ReferralDto);
    const body = {
      data: message,
      metadata: {
        timestamp: now.toISOString(),
        "record-type": "data",
        operation: "insert",
        "partition-key-type": "schema-table",
        "schema-name": "kyc",
        "table-name": "know-your-customer-referral",
        "transaction-id": "",
      },
    };
    await publisher.publish(event, message);
    verify(
      httpClientMock.post(url, deepEqual(body), deepEqual({ headers })),
    ).once();
  });
});
