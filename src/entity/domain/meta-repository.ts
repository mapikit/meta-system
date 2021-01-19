import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import constants from "@api/mapikit/constants";
import { Collection, Db, MongoClient } from "mongodb";

export class MetaRepository {
  private connection : MongoClient;
  private db : Db;
  private collection : Collection;

  constructor () {
    this.connection = new MongoClient(
      constants.MONGO.URL,
      {
        useUnifiedTopology: true,
        auth: {
          user: constants.MONGO.USER,
          password: constants.MONGO.PASS,
        },
      });
  }

  public async initialize (schema : SchemasType, systemName : string) : Promise<void> {
    await this.connection.connect();
    this.connection.db(systemName);
    this.db = this.connection.db(systemName);
    await this.checkoutCollection(schema.name);
    //In the future add validator if Rules are enabled
    //For more info see https://docs.mongodb.com/manual/core/schema-validation/
  }

  public async insert (entity : unknown) : Promise<void> {
    await this.collection.insertOne(entity);
  }

  public async delete (entity : unknown) : Promise<void> {
    await this.collection.deleteOne(entity);
  }

  public async update (entityId : string, newValue : unknown) : Promise<void> {
    await this.collection.updateOne({ id : entityId }, newValue);
  }

  public async findById (entityId : string) : Promise<unknown> {
    return this.collection.find({ id: entityId });
  }

  public async findByProperty (propertyName : string, propertyValue : unknown) : Promise<unknown> {
    return this.collection.find({ [propertyName] : propertyValue });
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
