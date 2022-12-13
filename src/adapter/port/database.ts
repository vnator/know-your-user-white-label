export type PrimitiveValues = string | boolean | number;
export type FlatObject = { [key: string]: PrimitiveValues };
export abstract class Database<Data = any, Result = any> {
  abstract upsert(table: string, keys: FlatObject, data: Data): Promise<Result>;
}
