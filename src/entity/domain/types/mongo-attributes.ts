import {
  CollectionCreateOptions,
  CollectionInsertOneOptions,
  CommonOptions,
  Cursor,
  DeleteWriteOpResultObject,
  FilterQuery,
  InsertOneWriteOpResult,
  MongoCallback,
  MongoClientCommonOption,
  UpdateOneOptions,
  UpdateQuery,
  UpdateWriteOpResult } from "mongodb";

export interface MongoClientAttributes {
  connect() : Promise<this>;
  isConnected(options ?: MongoClientCommonOption) : boolean;
  db(dbName : string, options ?: MongoClientCommonOption) : DbAttributes;
}

export interface DbAttributes {
  databaseName : string;
  collection(name : string, callback ?: MongoCallback<CollectionAttributes>) : CollectionAttributes;
  createCollection(name : string, options ?: CollectionCreateOptions) : Promise<CollectionAttributes>;
}

export interface CollectionAttributes {
  collectionName : string;
  find<Q>(query : FilterQuery<Q>) : Cursor | any;
  updateOne(
    filter : FilterQuery<unknown>,
    update : UpdateQuery<unknown> | Partial<unknown>,
    options ?: UpdateOneOptions
  ) : Promise<UpdateWriteOpResult>;

  deleteOne(
    filter : FilterQuery<unknown>,
    options ?: CommonOptions & {
      bypassDocumentValidation ?: boolean;
    }) : Promise<DeleteWriteOpResultObject>;

  insertOne(docs : unknown, options ?: CollectionInsertOneOptions) : Promise<InsertOneWriteOpResult<any>>;
}


