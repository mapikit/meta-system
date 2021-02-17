import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaFunctionErrors, SchemaFunctionErrorType } from "@api/schemas/domain/schema-functions-errors";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { InMemoryMongoClient } from "@test/doubles/in-memory-mongo-client";

type SchemasFunctionsTypes = {
  [key in SchemasFunctions] : Function;
}

class SchemasBopsFunctions implements SchemasFunctionsTypes {
  private repository : MetaRepository;
  constructor (repository : MetaRepository) {
    this.repository = repository;
  }

  public async create (...input : Array<Record<string, unknown>>)
    : Promise<unknown | SchemaFunctionErrorType> {
    if(input.length === 0) return SchemaFunctionErrors.create;
    const assembledObject = {};
    for(const inputProperty of input) Object.assign(assembledObject, inputProperty);
    await this.repository.insert(assembledObject);
    return assembledObject;
  }

  public get = null;
  public getById = null;
  public update = null;
  public updateById = null;
  public delete = null;
  public deleteById = null;
};


const repo = new MetaRepository(new InMemoryMongoClient());
// TODO this will eventually be aquired from systemConfig as below:
// const config = new Configuration(systemConfig)
// const repo = new MetaRepository(new MongoClient(config.dbConnectionString));
export const SchemaFunctions = new SchemasBopsFunctions(repo);
