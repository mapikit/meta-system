/* eslint-disable max-classes-per-file */
import { Collection, Db, MongoClient } from "mongodb";

export class MetaRepository {
  private connection : MongoClient;
  private db : Db;
  private collection : Collection;

  constructor (client : MongoClient) {
    this.connection = client;
  }

  public async initialize (schema : SchemasType, systemName : string) : Promise<void> {
    await this.connection.connect();
    this.connection.db(systemName);
    this.db = this.connection.db(systemName);
    await this.checkoutCollection(schema.name);
    //In the future add validator if Rules are enabled
  }

  public async insert (entity : any) : Promise<void> {
    await this.collection.insertOne(entity);
  }

  public async delete (entity : any) : Promise<void> {
    await this.collection.deleteOne(entity);
  }

  public async patch (newValue : any) : Promise<void> {
    await this.collection.updateOne({ id : newValue.id }, newValue);
  }

  public async findById (entityId : string) : Promise<any> {
    return this.collection.find({ id: entityId });
  }

  public async findByProperty (propertyName : string, propertyValue : any) : Promise<any> {
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

// <<<< Start: Interfaces and Types bellow will be removed from this file and imported in the future

export interface SchemasType {
  name : string;
  format : SchemaObject;
  routes : {
    getMethodEnabled : boolean;
    postMethodEnabled : boolean;
    deleteMethodEnabled : boolean;
    patchMethodEnabled : boolean;
    putMethodEnabled : boolean;
    queryParamsGetEnabled : boolean;
  };
}

export type SchemaObject = {
  [K in string] : SchemaTypeDefinition;
}

export type SchemaTypeDefinition = SchemaTypeDefinitionParameter
| SchemaTypeDefinitionArray
| SchemaTypeDefinitionObject;

export type SchemaTypeDefinitionParameter = {
  type : "string" | "boolean" | "number" | "date";
  refName ?: string;
}

export type SchemaTypeDefinitionArray = {
  type : "array";
  data : "string" | "boolean" | "number" | "date" | Record<string, SchemaObject>;
  refName ?: string;
}

export type SchemaTypeDefinitionObject = {
  type : "object";
  data : Record<string, SchemaTypeDefinition>;
}

// >>>> End
