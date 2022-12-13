import { AWSError, Request } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { faker } from '@faker-js/faker';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import DynamoDatabase from './dynamo-db.database';

describe('DynamoDatabase', () => {
  let database: DynamoDatabase;
  let documentClientMock: DocumentClient;
  let documentClient: DocumentClient;
  let resultMock: Request<any, AWSError>;
  let result: Request<any, AWSError>;
  let table: string;
  let id: string;
  let item: any;

  beforeEach(() => {
    item = { id: '1' };
    table = faker.datatype.string();
    id = faker.datatype.uuid();
    resultMock = mock<Request<DocumentClient.UpdateItemOutput, AWSError>>();
    when(resultMock.promise()).thenResolve({ Attributes: item });
    result = instance(resultMock);
    documentClientMock = mock(DocumentClient);
    when(documentClientMock.update(anything())).thenReturn(result);
    when(resultMock.promise()).thenResolve({ Item: item });
    when(documentClientMock.get(anything())).thenReturn(result);
    const queryMock = mock<Request<DocumentClient.QueryOutput, AWSError>>();
    const queryPromise = instance(queryMock);
    when(queryMock.promise()).thenResolve({ Items: [item], $response: null });
    when(documentClientMock.query(anything())).thenReturn(queryPromise);
    documentClient = instance(documentClientMock);
    database = new DynamoDatabase(documentClient);
  });

  it('should upsert an item', async () => {
    const item = { foo: 'bar', bar: 'baz' };
    const updateItemInput = {
      TableName: table,
      Key: { id },
      ExpressionAttributeNames: { '#foo': 'foo', '#bar': 'bar' },
      ExpressionAttributeValues: { ':foo': 'bar', ':bar': 'baz' },
      UpdateExpression: 'SET #foo = :foo, #bar = :bar',
      ReturnValues: 'ALL_NEW',
    };
    await database.upsert(table, { id }, item);
    verify(documentClientMock.update(deepEqual(updateItemInput))).once();
    verify(resultMock.promise()).once();
  });

  it('should get an item', async () => {
    const getItemInput = {
      TableName: table,
      Key: { id },
    };
    const item = await database.get(table, id);
    verify(documentClientMock.get(deepEqual(getItemInput))).once();
    expect(item).toEqual({ id: '1' });
  });

  it('should query with index', async () => {
    const conditions = { condition: 'value' };
    const filters = { filter: 'foo' };
    const IndexName = 'index';
    const expectedParams = {
      TableName: table,
      IndexName,
      ExpressionAttributeNames: {
        '#filter': 'filter',
        '#condition': 'condition',
      },
      ExpressionAttributeValues: {
        ':filter': 'foo',
        ':condition': 'value',
      },
      FilterExpression: '#filter = :filter',
      KeyConditionExpression: '#condition = :condition',
    };
    await database.query(table, IndexName, conditions, filters);
    verify(documentClientMock.query(deepEqual(expectedParams))).once();
  });

  it('should query without filters', async () => {
    const conditions = { condition: 'value' };
    const IndexName = 'index';
    const expectedParams = {
      TableName: table,
      IndexName,
      ExpressionAttributeNames: {
        '#condition': 'condition',
      },
      ExpressionAttributeValues: {
        ':condition': 'value',
      },
      FilterExpression: undefined,
      KeyConditionExpression: '#condition = :condition',
    };
    await database.query(table, IndexName, conditions);
    verify(documentClientMock.query(deepEqual(expectedParams))).once();
  });
});
