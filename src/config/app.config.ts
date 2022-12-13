import { registerAs } from '@nestjs/config';
import * as env from 'env-var';
import BaseConfig from './base.config';

export class AppConfig extends BaseConfig {
  readonly isProduction = env.get('NODE_ENV').asString() === 'production';
  readonly prettyLogs = env.get('PRETTY_LOGS').default('false').asBool();
}
export default registerAs('app', () => new AppConfig());
