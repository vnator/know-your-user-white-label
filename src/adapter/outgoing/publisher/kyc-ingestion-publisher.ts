import { Injectable } from "@nestjs/common";
import { HttpClient } from "src/adapter/port/http-client";
import { Publisher } from "src/adapter/port/publisher";
import { PublisherConfig } from "src/config/publisher.config";
import { MemberGetMemberDto } from "src/module/kyc/dto/member-get-member.dto";
import { PlanPreferenceDto } from "src/module/kyc/dto/plan-preference.dto";
import { ReferralDto } from "src/module/kyc/dto/referral.dto";
import { EventEnum } from "src/module/kyc/event/kyc-event.enum";
import { KycEvent } from "src/module/kyc/event/kyc.event";

type IngestionOperation = "insert" | "update";
type IngestionPartitionKey = "schema-table";

type IngestionMetadata = {
  timestamp: string;
  "record-type": string;
  operation: IngestionOperation;
  "partition-key-type": IngestionPartitionKey;
  "schema-name": string;
  "table-name": string;
  "transaction-id": string;
};

export type IngestionData =
  | ReferralDto
  | MemberGetMemberDto
  | PlanPreferenceDto;

type IngestionPayload = {
  data: IngestionData;
  metadata: IngestionMetadata;
};

@Injectable()
export class KycIngestionPublisher implements Publisher<IngestionData> {
  private readonly ingestionEndpoint: string;
  private readonly ingestionApiKey: string;
  constructor(
    private httpClient: HttpClient,
    publisherConfig: PublisherConfig,
  ) {
    this.ingestionEndpoint =
      `${publisherConfig.ingestionEndpoint}/analytics/ingestion/passive/kyc/`;
    this.ingestionApiKey = publisherConfig.ingestionApiKey;
  }

  private getMetadata(event: KycEvent): IngestionMetadata {
    const tables = {
      [EventEnum.KYC_MGM_ANSWERED]: "know-your-customer-mgm",
      [EventEnum.KYC_PLAN_PREFERENCE_ANSWERED]:
        "know-your-customer-plan-preference",
      [EventEnum.KYC_REFERRAL_ANSWERED]: "know-your-customer-referral",
    };
    const metadata: IngestionMetadata = {
      timestamp: new Date().toISOString(),
      "record-type": "data",
      operation: "insert",
      "partition-key-type": "schema-table",
      "schema-name": "kyc",
      "table-name": tables[event.type],
      "transaction-id": "",
    };
    return metadata;
  }
  public async publish(event: KycEvent, message: IngestionData): Promise<void> {
    const url = `${this.ingestionEndpoint}`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.ingestionApiKey,
      },
    };
    const metadata = this.getMetadata(event);
    const body = {
      data: message,
      metadata,
    };
    await this.httpClient.post<IngestionPayload>(url, body, options);
  }
}
