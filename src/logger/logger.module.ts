import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { PinoLoggerForRoot } from './pino.logger';
export { Logger } from './pino.logger';

@Module({
  imports: [ConfigModule, PinoLoggerForRoot],
  providers: [],
  exports: [],
})
export class LoggerModule {}
