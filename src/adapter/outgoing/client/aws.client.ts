import { ConfigService } from '@nestjs/config';
import { DynamoDB, SNS } from 'aws-sdk';
import { ClientConfiguration, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DatabaseConfig } from 'src/config/database.config';
import { PublisherConfig } from 'src/config/publisher.config';

export const getDynamoDBDocumentClient = (configService: ConfigService) => {
  const databaseConfig = configService.get<DatabaseConfig>('database');
  const options: ClientConfiguration = {
    endpoint: databaseConfig.dynamoEndPoint,
  };
  return new DynamoDB.DocumentClient(options);
};

export const getDynamoDBClient = (configService: ConfigService) => {
  const databaseConfig = configService.get<DatabaseConfig>('database');
  const options: ClientConfiguration = {
    endpoint: databaseConfig.dynamoEndPoint,
  };
  return new DynamoDB(options);
};

export const getSNSClient = (configService: ConfigService) => {
  const publisherConfig = configService.get<PublisherConfig>('publisher');
  const options: ClientConfiguration = {
    endpoint: publisherConfig.snsEndPoint,
  };
  return new SNS(options);
};

export const DynamoDbDocumentClientFactory = {
  provide: DocumentClient,
  useFactory: getDynamoDBDocumentClient,
  inject: [ConfigService],
};

export const DynamoDbClientFactory = {
  provide: DynamoDB,
  useFactory: getDynamoDBClient,
  inject: [ConfigService],
};

export const SNSClientFactory = {
  provide: SNS,
  useFactory: getSNSClient,
  inject: [ConfigService],
};
