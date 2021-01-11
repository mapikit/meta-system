/* eslint-disable max-classes-per-file */
import constants from "@api/mapikit/constants";
import { Collection, Db, MongoClient } from "mongodb";

type ValueTypes = {
  "string" : string;
  "boolean" : boolean;
  "number" : number;
}


export class MetaRepository {
  private connection = new MongoClient(
    constants.MONGO.URL,
    {
      useUnifiedTopology: true,
      auth: {
        user: constants.MONGO.USER,
        password: constants.MONGO.PASS,
      },
    },
  );

  private schema : SchemasType;
  private db : Db;
  private collection : Collection;

  constructor (schema : SchemasType) {
    this.schema = schema;
  }

  public async initialize (dbName : string) : Promise<void> {
    await this.connection.connect();
    this.db = this.connection.db(dbName);
    await this.db.createCollection(this.schema.name);
    //In the future add validator as if Rules are enabled
    this.collection = this.db.collection(this.schema.name);
  }

  public async insert (entity : any) : Promise<void> {
    await this.collection.insertOne(entity);
  }

  private


}

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

const test = new MetaRepository();

const mockSchema = {
  car: {
    name: "dasda",
    type: "string",
  },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test.insert(mockSchema, { car: { dasd: "asd" } });
