import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import appConfig, { AppConfig } from './app.config';
import databaseConfig, { DatabaseConfig } from './database.config';
import portConfig, { HttpConfig } from './http.config';
import publisherConfig, { PublisherConfig } from './publisher.config';

export const DynamicConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, databaseConfig, portConfig, publisherConfig],
});

@Module({
  imports: [DynamicConfigModule],
  providers: [DatabaseConfig, HttpConfig, AppConfig, PublisherConfig],
  exports: [DatabaseConfig, HttpConfig, AppConfig, PublisherConfig],
})
export class ConfigModule {}
