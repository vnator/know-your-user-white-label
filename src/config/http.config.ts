import { registerAs } from '@nestjs/config';
import * as env from 'env-var';
import BaseConfig from './base.config';

const prefix = BaseConfig.environmentAppPrefix;
export class HttpConfig extends BaseConfig {
  readonly httpPort = env
    .get(`${prefix}_HTTP_PORT`)
    .default(3000)
    .asIntPositive();
}
export default registerAs('http', () => new HttpConfig());
