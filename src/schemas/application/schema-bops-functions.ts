import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaFunctionErrors, SchemaFunctionErrorType } from "@api/schemas/domain/schema-functions-errors";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { InMemoryMongoClient } from "@test/doubles/in-memory-mongo-client";

type SchemasFunctionsTypes = {
  [key in SchemasFunctions] : Function;
}

class SchemasBopsFunctions implements SchemasFunctionsTypes {
  public repository : MetaRepository;
  constructor (repository : MetaRepository) {
    this.repository = repository;
  }

  public async create (input : Record<string, unknown>)
    : Promise<unknown | SchemaFunctionErrorType> {
    if(!input || Object.keys(input).length === 0) return { errorMessage: SchemaFunctionErrors.create.nullInput };
    const insertionResult = await this.repository.insert(input);
    return { createdEntity : await this.repository.findById(insertionResult.insertedId) };
  }

  public get = null;
  public getById = null;
  public update = null;
  public updateById = null;
  public delete = null;

  public async deleteById (id : string) : Promise<unknown | SchemaFunctionErrorType> {
    const entity = await this.repository.findById(id);
    if(!id) return { errorMessage: SchemaFunctionErrors.deleteById.nullInput };
    if(!entity) return { errorMessage: SchemaFunctionErrors.deleteById.notFound };
    await this.repository.deleteById(id);
    return { deleted: entity };
  };
};


const repo = new MetaRepository(new InMemoryMongoClient());
// TODO this will eventually be aquired from systemConfig as below:
// const config = new Configuration(systemConfig)
// const repo = new MetaRepository(new MongoClient(config.dbConnectionString));
export const SchemaFunctions = new SchemasBopsFunctions(repo);
