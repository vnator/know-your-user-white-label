import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import {
  DynamoDbDocumentClientFactory,
  DynamoDbClientFactory,
  SNSClientFactory,
} from './outgoing/client/aws.client';
import DynamoDatabase from './outgoing/database/dynamo-db.database';
import { KycProducerProvider } from './outgoing/producer/kyc.producer';
import { KycIngestionPublisher } from './outgoing/publisher/kyc-ingestion-publisher';
import { KycPublisherProvider } from './outgoing/publisher/kyc-publisher';
import { HealthCheckProvider } from './outgoing/repository/health-check.repository';
import {
  KycQueryRepositoryProvider,
  KycCommandRepositoryProvider,
} from './outgoing/repository/kyc.repository';
import { HttpClientProvider } from './outgoing/client/http.client';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    DynamoDbDocumentClientFactory,
    DynamoDbClientFactory,
    DynamoDatabase,
    HealthCheckProvider,
    KycCommandRepositoryProvider,
    KycQueryRepositoryProvider,
    KycProducerProvider,
    SNSClientFactory,
    KycPublisherProvider,
    HttpClientProvider,
    KycIngestionPublisher,
  ],
  exports: [
    DynamoDatabase,
    HealthCheckProvider,
    KycCommandRepositoryProvider,
    KycQueryRepositoryProvider,
    KycProducerProvider,
  ],
})
export class AdapterModule {}
