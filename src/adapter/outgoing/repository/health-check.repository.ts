import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { DatabaseConfig } from 'src/config/database.config';
import { HealthCheckRepository as IHealthCheckRepository } from 'src/module/app/port/health-check.repository';

@Injectable()
export class HealthCheckRepository implements IHealthCheckRepository {
  constructor(
    private readonly dynamoClient: DynamoDB,
    private readonly databaseConfig: DatabaseConfig,
  ) {}

  async databaseConnections(): Promise<void> {
    await this.dynamoClient
      .describeTable({ TableName: this.databaseConfig.table })
      .promise();
  }
}

export const HealthCheckProvider = {
  provide: IHealthCheckRepository,
  useClass: HealthCheckRepository,
};
