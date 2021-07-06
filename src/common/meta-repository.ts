import * as Mongo from "mongodb";
import { SchemasType } from "../configuration/schemas/schemas-type";

export class MetaRepository {
  private connection : Mongo.MongoClient;
  private db : Mongo.Db;
  private collection : Mongo.Collection;

  constructor (connection : Mongo.MongoClient) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async insert (entity : unknown) : Promise<Mongo.InsertOneWriteOpResult<any>> {
    return this.collection.insertOne(entity);
  }

  public async deleteById (id : string) : Promise<Mongo.DeleteWriteOpResultObject> {
    return this.collection.deleteOne({ _id : new Mongo.ObjectId(id) });
  }

  public async updateById (entityId : string, newValue : unknown) : Promise<Mongo.UpdateWriteOpResult> {
    return this.collection.updateOne({ _id : new Mongo.ObjectId(entityId) }, { $set: newValue });
  }

  public async update<T> (newValue : unknown, filterQuery : Mongo.FilterQuery<T>) : Promise<Mongo.UpdateWriteOpResult> {
    return this.collection.updateMany(filterQuery, { "$set": newValue });
  }

  public async delete<T> (filterQuery : Mongo.FilterQuery<T>) : Promise<Mongo.DeleteWriteOpResultObject> {
    return this.collection.deleteMany(filterQuery);
  }

  public async findById (entityId : string) : Promise<unknown> {
    return this.collection.findOne({ _id: new Mongo.ObjectId(entityId) });
  }

  public async findByProperty (propertyName : string, propertyValue : unknown) : Promise<unknown> {
    return this.collection.find({ [propertyName] : propertyValue }).toArray();
  }

  public async query<T> (query : Mongo.FilterQuery<T>) : Promise<unknown[]> {
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
