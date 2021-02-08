/* eslint-disable max-classes-per-file */
import { CollectionAttributes, DbAttributes, MongoClientAttributes } from "@api/entity/domain/types/mongo-attributes";
import faker from "faker";
import { UpdateWriteOpResult, DeleteWriteOpResultObject, FilterQuery, InsertOneWriteOpResult, ObjectId } from "mongodb";

export class MockMongoClient implements MongoClientAttributes {
  public connected = false;
  public activeDbs : Array<MockDb> = [];
  connect () : Promise<this> {
    return new Promise<this>(resolve => {
      this.connected = true;
      resolve(this);
    });
  }

  isConnected () : boolean {
    return this.connected;
  }

  db (dbName : string) : MockDb {
    const foundDb = this.activeDbs.find(db => db.databaseName === dbName);
    if(foundDb) return foundDb;
    const createdDb = new MockDb(dbName);
    this.activeDbs.push(createdDb);
    return createdDb;
  }
}

class MockDb implements DbAttributes {
  public databaseName : string;
  public activeCollections : Array<MockCollection> = [];

  constructor (name : string) {
    this.databaseName = name;
    return this;
  }

  collection (name : string) : MockCollection {
    const collection = this.activeCollections.find((col) => {
      return col.collectionName == name;
    });
    return collection;
  }

  createCollection (name : string) : Promise<MockCollection> {
    return new Promise(resolve => {
      const createdColl = new MockCollection(name);
      this.activeCollections.push(createdColl);
      resolve(createdColl);
    });
  }
}

class MockCollection implements CollectionAttributes {
  public collectionName : string;
  public entities = [];

  constructor (name : string) {
    this.collectionName = name;
    return this;
  }

  find (query : FilterQuery<unknown>) : unknown {
    return {
      toArray: () : Array<unknown> => this.entities,
      next: () : unknown => this.entities.filter(entity => {
        for(const prop of Object.keys(query)) {
          return entity[prop] === query[prop];
        }
      }),
    };
  }

  // eslint-disable-next-line max-lines-per-function
  insertOne (entity : any) : Promise<InsertOneWriteOpResult<any>> {
    const newId = faker.random.alphaNumeric(12); //Must be a 12 letters string. See mongodb ObjectId for more info
    entity._id = newId;
    this.entities.push(entity);
    return new Promise(resolve => {
      resolve(
        {
          insertedCount: 1,
          ops: [],
          insertedId: newId,
          connection: undefined,
          result: { ok: 1, n: 1 },
        });
    });
  }

  // eslint-disable-next-line max-lines-per-function
  updateOne (filter : FilterQuery<unknown>, update : Partial<unknown>) : Promise<UpdateWriteOpResult> {
    let id : string;
    this.entities.forEach((entity, index) => {
      if(filter._id === entity._id) {
        this.entities.splice(index, 1);
        this.entities.push(update);
        id = entity._id;
      }
    });

    return new Promise(resolve => {
      resolve({
        result: { ok: 1, n: 1, nModified: 1 },
        connection: undefined,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 1,
        upsertedId: { _id: new ObjectId(id) },
      });
    });
  }

  // eslint-disable-next-line max-lines-per-function
  deleteOne (filter : FilterQuery<unknown>) : Promise<DeleteWriteOpResultObject> {
    this.entities.forEach((entity, index) => {
      if(entity._id === filter._id) {
        this.entities.splice(index, 1);
      }
    });

    return new Promise(resolve => {
      resolve({
        result: {
          ok: 1,
          n: 1,
        },
        connection: undefined,
        deletedCount: 1,
      });
    });
  }
}
