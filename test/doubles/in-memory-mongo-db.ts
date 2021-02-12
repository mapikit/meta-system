import { DbAttributes } from "@api/entity/domain/types/mongo-attributes";
import { InMemoryCollection } from "./in-memory-mongo-collection";

export class InMemoryDb implements DbAttributes {
  public databaseName : string;
  public activeCollections : Array<InMemoryCollection> = [];

  constructor (name : string) {
    this.databaseName = name;
    return this;
  }

  collection (name : string) : InMemoryCollection {
    const collection = this.activeCollections.find((col) => {
      return col.collectionName == name;
    });
    return collection;
  }

  createCollection (name : string) : Promise<InMemoryCollection> {
    return new Promise(resolve => {
      const createdColl = new InMemoryCollection(name);
      this.activeCollections.push(createdColl);
      resolve(createdColl);
    });
  }
}
