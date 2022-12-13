import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import { AppConfig } from 'src/config/app.config';
import {
  getTransport,
  genReqId,
  customLogLevel,
  customSuccessMessage,
  ignore,
} from './logger.config';
export { Logger } from 'nestjs-pino';

export const PinoLoggerForRoot = PinoModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    const appConfig = configService.get<AppConfig>('app');
    const transport = getTransport(appConfig.prettyLogs, 'pino-pretty');
    return {
      pinoHttp: {
        genReqId,
        autoLogging: {
          ignore,
        },
        transport,
        customLogLevel,
        customSuccessMessage,
      },
    };
  },
  inject: [ConfigService],
});
