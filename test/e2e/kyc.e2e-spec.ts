import { HttpStatus, INestApplication } from "@nestjs/common";
import { SNS, SQS } from "aws-sdk";
import { HttpService } from "@nestjs/axios";
import * as request from "supertest";
import { of } from "rxjs";
import { PublisherConfig } from "src/config/publisher.config";
import { CreateMemberGetMemberDto } from "src/module/kyc/dto/member-get-member.dto";
import { CreateReferralDto } from "src/module/kyc/dto/referral.dto";
import { CreatePlanPreferenceDto } from "src/module/kyc/dto/plan-preference.dto";
import { getApp } from "test/helper/http-app";
import { getNotificationMessage } from "test/helper/sqs";
import { fake } from "test/mock";

const publisherConfig = new PublisherConfig();

describe("KycController (e2e)", () => {
  let app: INestApplication;
  let getMessage: (id: string) => Promise<any>;
  let httpServiceMock: HttpService;
  const baseUrl = "/kyc";
  const queueName = "kyc-dev-queue";
  const region = process.env.AWS_REGION || "us-east-1";
  const sqs = new SQS({ endpoint: publisherConfig.snsEndPoint });

  beforeAll(async () => {
    app = await getApp();
    const sns = app.get(SNS);
    await sqs
      .createQueue({
        QueueName: queueName,
      })
      .promise();
    await sns
      .subscribe({
        TopicArn: publisherConfig.createTopicArn,
        Protocol: "sqs",
        Endpoint: `arn:aws:sqs:${region}:000000000000:${queueName}`,
      })
      .promise();
    getMessage = getNotificationMessage(publisherConfig.snsEndPoint, queueName);
  }, 30000);

  afterAll(async () => {
    jest.clearAllMocks();
    const params = {
      QueueUrl: `${publisherConfig.snsEndPoint}/000000000000/${queueName}`,
    };
    return sqs.deleteQueue(params).promise();
  });

  beforeEach(async () => {
    app = await getApp();
    await app.init();
    const ingestionResponse = {
      data: {},
      status: HttpStatus.OK,
      statusText: "Ok",
      headers: {},
      config: {},
    };
    httpServiceMock = app.get<HttpService>(HttpService);
    jest
      .spyOn(httpServiceMock, "post")
      .mockImplementation(() => of(ingestionResponse));
  });

  afterEach(() => {
    (httpServiceMock as jest.Mocked<HttpService>).post.mockClear();
  });

  describe("member-get-member", () => {
    let mgm: CreateMemberGetMemberDto;
    let customer: string;
    beforeEach(() => {
      mgm = fake(CreateMemberGetMemberDto);
    });

    it(`${baseUrl}/member-get-member (POST) - member-get-member`, async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/member-get-member`)
        .send(mgm)
        .expect("Request-Id", /.*/)
        .expect(HttpStatus.CREATED);
      const message = await getMessage(mgm.customerReferenceId);
      expect(message).toBeDefined();
      expect(message.customerReferenceId).toEqual(mgm.customerReferenceId);
      expect(httpServiceMock.post).toHaveBeenCalledTimes(1);
      customer = message.customerReferenceId;
    });

    it(`${baseUrl}/member-get-member/customer-reference/${customer} (GET) - member-get-member`, async () => {
      const result = await request(app.getHttpServer())
        .get(`${baseUrl}/member-get-member/customer-reference/${customer}`)
        .expect("Request-Id", /.*/)
        .expect(HttpStatus.OK);
      expect(result).toBeDefined();
      expect(result.body).toBeDefined();
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBeGreaterThanOrEqual(1);
    });

    describe("Errors", () => {
      it(`${baseUrl}/member-get-member/customer-reference/${null} (GET) - member-get-member`, async () => {
        await request(app.getHttpServer())
          .get(`${baseUrl}/member-get-member/customer-reference/${null}`)
          .expect("Request-Id", /.*/)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe("plan-preference", () => {
    let planPreference: CreatePlanPreferenceDto;
    let customer: string;
    beforeEach(() => {
      planPreference = fake(CreatePlanPreferenceDto);
    });

    it(`${baseUrl}/plan-preference (POST) - plan-preference`, async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/plan-preference`)
        .send(planPreference)
        .set("Accept-Version", "v1")
        .expect("Request-Id", /.*/)
        .expect(HttpStatus.CREATED);
      const message = await getMessage(planPreference.customerReferenceId);
      expect(message).toBeDefined();
      expect(message.customerReferenceId).toEqual(
        planPreference.customerReferenceId,
      );
      expect(httpServiceMock.post).toHaveBeenCalledTimes(1);
      customer = message.customerReferenceId;
    });

    it(`${baseUrl}/plan-preference/customer-reference/:custumerReferenceId (GET) - plan-preference`, async () => {
      const result = await request(app.getHttpServer())
        .get(`${baseUrl}/plan-preference/customer-reference/${customer}`)
        .expect("Request-Id", /.*/)
        .expect(HttpStatus.OK);
      expect(result).toBeDefined();
      expect(result.body).toBeDefined();
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBeGreaterThanOrEqual(1);
    });

    describe("Errors", () => {
      it(`${baseUrl}/plan-preference (POST) - plan-preference`, async () => {
        await request(app.getHttpServer())
          .post(`${baseUrl}/plan-preference`)
          .send(planPreference)
          .set("Accept-Version", "v2")
          .expect("Request-Id", /.*/)
          .expect(HttpStatus.NOT_FOUND);
      });

      it(`${baseUrl}/plan-preference/customer-reference/:custumerReferenceId (GET) - plan-preference`, async () => {
        await request(app.getHttpServer())
          .get(`${baseUrl}/plan-preference/customer-reference/${null}`)
          .expect("Request-Id", /.*/)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe("referral", () => {
    let referral: CreateReferralDto;
    beforeEach(() => {
      referral = fake(CreateReferralDto);
    });

    it(`${baseUrl}/referral (POST) - referral`, async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/referral`)
        .send(referral)
        .set("Accept-Version", "v1")
        .expect("Request-Id", /.*/)
        .expect(HttpStatus.CREATED);
      const message = await getMessage(referral.customerReferenceId);
      expect(message).toBeDefined();
      expect(message.customerReferenceId).toEqual(referral.customerReferenceId);
      expect(httpServiceMock.post).toHaveBeenCalledTimes(1);
    });
  });
});
