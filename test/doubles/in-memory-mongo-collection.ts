import { CollectionAttributes } from "@api/entity/domain/types/mongo-attributes";
import faker from "faker";
import { DeleteWriteOpResultObject, FilterQuery, InsertOneWriteOpResult, ObjectId, UpdateWriteOpResult } from "mongodb";

export class InMemoryCollection implements CollectionAttributes {
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

  insertOne (entity : Record<string, unknown>) : Promise<InsertOneWriteOpResult<Record<"_id", unknown>>> {
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
        result: { ok: 1, n: 1 },
        connection: undefined,
        deletedCount: 1,
      });
    });
  }
}
