import { AWSError, Request } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DatabaseConfig } from 'src/config/database.config';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { HealthCheckRepository } from './health-check.repository';

describe('HealthCheckRepository', () => {
  let repository: HealthCheckRepository;
  let dynamoDB: DynamoDB;
  let dynamoDBMock: DynamoDB;
  let resultMock: Request<any, AWSError>;
  let result: Request<any, AWSError>;
  const table = 'table';

  beforeEach(async () => {
    resultMock = mock<Request<any, AWSError>>();
    result = instance(resultMock);
    dynamoDBMock = mock(DynamoDB);
    when(dynamoDBMock.describeTable(anything())).thenReturn(result);
    dynamoDB = instance(dynamoDBMock);
    repository = new HealthCheckRepository(dynamoDB, {
      table,
    } as DatabaseConfig);
  });

  it('should describe table', async () => {
    await repository.databaseConnections();
    verify(dynamoDBMock.describeTable(deepEqual({ TableName: table }))).once();
  });
});
