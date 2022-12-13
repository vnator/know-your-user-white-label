import { Injectable } from '@nestjs/common';
import { DocumentClient, Key } from 'aws-sdk/clients/dynamodb';
import { map, mapKeys, mapValues, zipObject } from 'lodash';
import { Database, FlatObject } from 'src/adapter/port/database';

@Injectable()
export default class DynamoDatabase implements Database {
  constructor(private client: DocumentClient) {}

  private getExpressionAttributes(data: FlatObject) {
    const ExpressionAttributeNames = zipObject(
      map(data, (value, k) => `#${k}`),
      map(data, (value, k) => k),
    );
    const ExpressionAttributeValues = mapValues(
      mapKeys(data, (value, k) => `:${k}`),
    );
    return { ExpressionAttributeNames, ExpressionAttributeValues };
  }

  private getAttributeSet(data: FlatObject) {
    const attributeSet = map(data, (value, k) => `#${k} = :${k}`);
    return attributeSet;
  }

  private getUpdateItemInput(
    table: string,
    keys: FlatObject,
    data: FlatObject,
  ) {
    const attributeSet = this.getAttributeSet(data);
    const { ExpressionAttributeNames, ExpressionAttributeValues } =
      this.getExpressionAttributes(data);
    const updateItemInput = {
      TableName: table,
      Key: { ...keys } as Key,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression: `SET ${attributeSet.join(', ')}`,
      ReturnValues: 'ALL_NEW',
    };
    return updateItemInput;
  }

  async upsert(table: string, keys: FlatObject, obj: any): Promise<any> {
    const updateItemInput = this.getUpdateItemInput(table, keys, obj);
    const result = await this.client.update(updateItemInput).promise();
    return result.Attributes;
  }

  async get(table: string, id: string): Promise<unknown> {
    const result = await this.client
      .get({
        TableName: table,
        Key: { id },
      })
      .promise();
    return result.Item;
  }

  async query(
    table: string,
    indexName: string,
    conditions: FlatObject,
    filters?: FlatObject,
  ): Promise<unknown[]> {
    const { ExpressionAttributeNames, ExpressionAttributeValues } =
      this.getExpressionAttributes({ ...conditions, ...(filters || {}) });
    const FilterExpression = filters
      ? this.getAttributeSet(filters).join(' AND ')
      : undefined;
    const KeyConditionExpression =
      this.getAttributeSet(conditions).join(' AND ');
    const params = {
      TableName: table,
      IndexName: indexName,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      FilterExpression,
      KeyConditionExpression,
    };
    const result = await this.client.query(params).promise();
    return result.Items;
  }
}
