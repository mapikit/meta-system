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

  /*This current fake implementation of query returns any entity that matches any of the parameters
  ie we have {e1: {a: 12, b:6}, e2: {a: 9, b:18}} and query with {a: 12, b: 18}. This would return
  both e1 and e2. So TODO check if this behavior matches repository query or it is suposed to return
  blank

  TL;DR: check if query parameters are treated as AND or as OR*/
  public async query (queryTerm : Partial<Entity>) : Promise<Entity[]> {
    const queryKeys = Object.keys(queryTerm);
    return this.db[this.currentDb][this.currentCollection].filter(entity => {
      for (const key of queryKeys) {
        if(entity[key] == queryTerm[key]) {
          return true;
        }
      }
      return false;
    });
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
