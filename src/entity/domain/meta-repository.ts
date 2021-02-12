import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { DeleteWriteOpResultObject, FilterQuery, InsertOneWriteOpResult, UpdateWriteOpResult } from "mongodb";
import { CollectionAttributes, DbAttributes, MongoClientAttributes } from "./types/mongo-attributes";

export class MetaRepository {
  private connection : MongoClientAttributes;
  private db : DbAttributes;
  private collection : CollectionAttributes;

  constructor (connection : MongoClientAttributes) {
    this.connection = connection;
  }

  public async initialize (schema : SchemasType, systemName : string) : Promise<void> {
    if(!this.connection.isConnected()) {
      await this.connection.connect();
    }
    this.db = this.connection.db(systemName);
    await this.checkoutCollection(schema.name);
    //In the future add validator if Rules are enabled
    //For more info see https://docs.mongodb.com/manual/core/schema-validation/
  }

  public async insert (entity : unknown) : Promise<InsertOneWriteOpResult<any>> {
    return this.collection.insertOne(entity);
  }

  public async deleteById (id : string) : Promise<DeleteWriteOpResultObject> {
    return this.collection.deleteOne({ _id : id });
  }

  public async update (entityId : string, newValue : unknown) : Promise<UpdateWriteOpResult> {
    return this.collection.updateOne({ _id : entityId }, newValue);
  }

  public async findById (entityId : string) : Promise<unknown> {
    return this.collection.find({ _id: entityId }).next();
  }

  public async findByProperty (propertyName : string, propertyValue : unknown) : Promise<unknown> {
    return this.collection.find({ [propertyName] : propertyValue }).toArray();
  }

  public async query<T> (query : FilterQuery<T>) : Promise<unknown> {
    return this.collection.find(query).toArray();
  }

  private async checkoutCollection (collection : string) : Promise<void> {
    const existingCollection = this.db.collection(collection);
    if(existingCollection) {
      this.collection = existingCollection;
    } else {
      this.collection = await this.db.createCollection(collection);
    }
  }
}
