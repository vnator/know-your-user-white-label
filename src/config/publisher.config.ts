import { registerAs } from "@nestjs/config";
import * as env from "env-var";
import BaseConfig from "./base.config";

const prefix = BaseConfig.environmentAppPrefix;
export class PublisherConfig extends BaseConfig {
  readonly createTopicArn = env
    .get(`${prefix}_SNS_CREATE_TOPIC_ARN`)
    .asString();
  readonly mgmAnswered = env.get(`${prefix}_MGM_ANSWERED_TOPIC`).asString();
  readonly planPreferenceAnswered = env
    .get(`${prefix}_PLAN_PREFERENCE_ANSWERED_TOPIC`)
    .asString();
  readonly referralAnswered = env
    .get(`${prefix}_REFERRAL_ANSWERED_TOPIC`)
    .asString();
  readonly snsEndPoint = env.get(`${prefix}_SNS_URL`).asString();
  readonly ingestionEndpoint = env.get(`${prefix}_INGESTION_URL`).asString();
  readonly ingestionApiKey = env.get(`${prefix}_INGESTION_API_KEY`).asString();
}
export default registerAs("publisher", () => new PublisherConfig());
