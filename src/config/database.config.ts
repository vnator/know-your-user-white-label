import { registerAs } from '@nestjs/config';
import * as env from 'env-var';
import BaseConfig from './base.config';

const prefix = BaseConfig.environmentAppPrefix;
export class DatabaseConfig extends BaseConfig {
  readonly table = env.get(`${prefix}_DYNAMO_TABLE`).asString();
  readonly dynamoEndPoint = env.get(`${prefix}_DYNAMO_URL`).asString();
}
export default registerAs('database', () => new DatabaseConfig());
