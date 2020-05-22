import { MongoClient, Db, Collection } from "mongodb";
import constants from "@api/mapikit/constants";
import { MongoRepositoryAttributes } from "@api/entity/domain/repositories/mongo-repository";
import { EntityAttributes } from "@api/entity/domain/types/entity-attributes";

export class MongoRepository implements MongoRepositoryAttributes {
  private readonly connection : MongoClient = new MongoClient(
    constants.MONGO.URL,
    {
      useUnifiedTopology: true,
      auth: {
        user: constants.MONGO.USER,
        password: constants.MONGO.PASS,
      },
    },
  );

  private workingDb ?: Db;
  private workingCollection ?: Collection;

  public async initialize () : Promise<this> {
    await this.connection.connect();
    return this;
  }

  public async initializeInDb (databaseName : string) : Promise<void> {
    await this.connection.connect();
    await this.checkoutDatabase(databaseName);
  }

  public async createDatabase (databaseName : string) : Promise<void> {
    this.connection.db(databaseName);
  }

  public async createCollection (collectionName : string) : Promise<void> {
    await this.workingDb.createCollection(collectionName);
  }

  public async selectCollection (collectionName : string) : Promise<void> {
    this.workingCollection = this.workingDb.collection(collectionName);
  }

  public async dropCollection (collectionName : string) : Promise<void> {
    await this.workingDb.dropCollection(collectionName);
  }

  public async checkoutDatabase (databaseName : string) : Promise<void> {
    this.workingDb = this.connection.db(databaseName);
  }

  public async getEntities () : Promise<any> {
    return this.workingCollection.find();
  }

  public async insert (entity : EntityAttributes) : Promise<void> {
    await this.workingCollection.insertOne(entity);
  }

  public async close () : Promise<void> {
    await this.connection.close();
  }
};
