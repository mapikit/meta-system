import { MongoRepositoryAttributes } from "@api/entity/domain/repositories/mongo-repository";
import { EntityAttributes } from "@api/entity/domain/types/entity-attributes";
import { Entity } from "@api/entity/domain/models/entity";


//In the future implementation will be required
export class InMemoryMongoRepository implements MongoRepositoryAttributes {
  public db : MongoRepositoryRepresentation = {};
  public currentCollection : string;
  public currentDb : string;
  public initialize () : Promise<this> {
    this.db = {};
    return new Promise(resolve => {
      resolve(this);
    });
  }

  public async initializeInDb (databaseName : string) : Promise<void> {
    this.db = {};
    await this.createDatabase(databaseName);
    this.currentDb = databaseName;
    return;
  }

  public createDatabase (databaseName : string) : Promise<void> {
    if(!this.db[databaseName]) {
      this.db[databaseName] = {};
    }
    return;
  };

  public async checkoutDatabase (databaseName : string) : Promise<void> {
    await this.createDatabase(databaseName);
    this.currentDb = databaseName;
    return;
  };

  public createCollection (collectionName : string) : Promise<void> {
    if(!this.db[this.currentDb][collectionName]) {
      this.db[this.currentDb][collectionName] = [];
    }
    return;
  };

  public async selectCollection (collectionName : string) : Promise<void> {
    this.currentCollection = collectionName;
    return;
  };

  public async dropCollection (collectionName : string) : Promise<void> {
    delete this.db[this.currentDb][collectionName];
  }

  public async insert (entity : Entity) : Promise<void> {
    this.db[this.currentDb][this.currentCollection].push(entity);
  }

  public async getEntities () : Promise<EntityAttributes[]> {
    return this.db[this.currentDb][this.currentCollection];
  }

  public close () : Promise<void> {
    this.currentCollection = undefined;
    this.currentDb = undefined;
    return;
  };
}

interface MongoRepositoryRepresentation {
  [dbClientName : string ] : {
    [collectionSchemaId : string] : EntityAttributes[];
  };
};
