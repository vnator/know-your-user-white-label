import helmet from 'helmet';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'src/logger/logger.module';
import { AdapterModule } from 'src/adapter/adapter.module';
import { ConfigModule } from 'src/config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KycModule } from '../kyc/kyc.module';
import { requestId } from './middleware/request-id.middleware';
import { CustomExceptionFilter } from './filter/custom-exception.filter';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    AdapterModule,
    KycModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestId(), helmet()).forRoutes('*');
  }
}
