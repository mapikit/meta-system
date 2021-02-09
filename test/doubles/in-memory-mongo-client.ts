import { MongoClientAttributes } from "@api/entity/domain/types/mongo-attributes";
import { InMemoryDb } from "./in-memory-mongo-db";

export class InMemoryMongoClient implements MongoClientAttributes {
  public connected = false;
  public activeDbs : Array<InMemoryDb> = [];
  connect () : Promise<this> {
    return new Promise<this>(resolve => {
      this.connected = true;
      resolve(this);
    });
  }

  isConnected () : boolean {
    return this.connected;
  }

  db (dbName : string) : InMemoryDb {
    const foundDb = this.activeDbs.find(db => db.databaseName === dbName);
    if(foundDb) return foundDb;
    const createdDb = new InMemoryDb(dbName);
    this.activeDbs.push(createdDb);
    return createdDb;
  }
}
