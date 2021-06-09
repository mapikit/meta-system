import isNill from "@api/common/assertions/is-nill";
import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaFunctionErrors, SchemaFunctionErrorType } from "@api/schemas/domain/schema-functions-errors";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { FilterQuery } from "mongodb";
import { MongoSchemaQueryBuilder } from "./query-builder/query-builder";

type SchemasFunctionsTypes = {
  [key in SchemasFunctions] : Function;
}

export class SchemasBopsFunctions implements SchemasFunctionsTypes {
  private readonly repository : MetaRepository;
  private workingSchema : SchemasType;

  public constructor (options : { MetaRepository : MetaRepository }) {
    this.repository = options.MetaRepository;

    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.updateById = this.updateById.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  public set schema (schemaType : SchemasType) {
    this.workingSchema = schemaType;
  }

  public async create (input : { entity : CloudedObject })
    : Promise<unknown | SchemaFunctionErrorType> {
    if(isNill(input.entity) || Object.keys(input.entity).length === 0) {
      return ({ createError: SchemaFunctionErrors.create.nullInput });
    }

    const insertionResult = await this.repository.insert(input.entity);

    return ({ createdEntity : await this.repository.findById(insertionResult.insertedId) });
  }

  public async getById (input : { id : string })
    : Promise<unknown | SchemaFunctionErrorType> {
    let found = false;

    if (isNill(input.id)) {
      return ({
        found,
        getError: SchemaFunctionErrors.getById.nullInput,
      });
    }

    const entity = await this.repository.findById(input.id);
    found = !isNill(entity);

    return ({ found, entity });

  }

  // eslint-disable-next-line max-lines-per-function
  public async updateById (input : { id : string; valuesToUpdate : CloudedObject })
    : Promise<unknown | SchemaFunctionErrorType> {
    if (isNill(input.id)) {
      return { errorMessage: SchemaFunctionErrors.updateById.nullInput };
    }

    let hasError = false;
    let notFound = false;

    const updateResult = await this.repository.updateById(input.id, input.valuesToUpdate)
      .catch((result) => { hasError = true; return result; });

    if (hasError) { return { updateError: SchemaFunctionErrors.updateById.genericError }; }

    if (Number.isNaN(updateResult.modifiedCount) || updateResult.modifiedCount < 1) {
      notFound = true;
    }

    if (notFound) { return { updateError: SchemaFunctionErrors.updateById.notFound }; }

    return { updatedEntity: await this.repository.findById(input.id) };
  }

  // eslint-disable-next-line max-lines-per-function
  public async get (input : { query : Record<string, unknown> }) : Promise<unknown | SchemaFunctionErrorType> {
    const queryBuilder = new MongoSchemaQueryBuilder(input.query, this.workingSchema);
    let dbQuery : FilterQuery<unknown>;
    let errorMessage;

    try { dbQuery = queryBuilder.getFullMongoQuery(); }
    catch { errorMessage = SchemaFunctionErrors.get.invalidSearchArgument; }

    if (errorMessage !== undefined) {
      return ({ getError: errorMessage });
    }

    const result = await this.repository.query(dbQuery)
      .catch(() => { errorMessage = SchemaFunctionErrors.get.genericError; });

    if (errorMessage !== undefined) {
      return ({ getError: errorMessage });
    }

    return ({ results: result });
  };

  // eslint-disable-next-line max-lines-per-function
  public async update (input : { query : Record<string, unknown>; valuesToUpdate : Record<string, unknown> })
    : Promise<unknown | SchemaFunctionErrorType> {
    const queryBuilder = new MongoSchemaQueryBuilder(input.query, this.workingSchema);

    let dbQuery : FilterQuery<unknown>;
    let errorMessage;
    let updatedCount : number;

    try { dbQuery = queryBuilder.getFullMongoQuery(); }
    catch { errorMessage = SchemaFunctionErrors.update.invalidQueryArgument; }

    if (errorMessage !== undefined) return ({ updateError: errorMessage });

    await this.repository.update(input.valuesToUpdate, dbQuery)
      .then((result) => { updatedCount = result.modifiedCount; })
      .catch(() => { errorMessage = SchemaFunctionErrors.update.genericError; });

    if (errorMessage !== undefined) return ({ updateError: errorMessage });

    return ({ updatedCount: updatedCount });
  } ;

  public async delete (input : { query : Record<string, unknown> }) : Promise<unknown | SchemaFunctionErrorType> {
    const queryBuilder = new MongoSchemaQueryBuilder(input.query, this.workingSchema);

    let dbQuery : FilterQuery<unknown>;
    let errorMessage;
    let deletedCount : number;

    try { dbQuery = queryBuilder.getFullMongoQuery(); }
    catch { errorMessage = SchemaFunctionErrors.delete.invalidQueryArgument; }

    if (errorMessage !== undefined) return ({ deleteError: errorMessage });

    await this.repository.delete(dbQuery)
      .then((result) => { deletedCount = result.deletedCount; })
      .catch(() => { errorMessage = SchemaFunctionErrors.delete.genericError; });

    if (errorMessage !== undefined) return ({ deleteError: errorMessage });

    return ({ deletedCount });
  }

  public async deleteById (input : { id : string }) : Promise<unknown | SchemaFunctionErrorType> {
    if(isNill(input.id)) {
      return ({ deleteError: SchemaFunctionErrors.deleteById.nullInput });
    };

    const entity = await this.repository.findById(input.id);

    if(isNill(entity)) {
      return ({ deleteError: SchemaFunctionErrors.deleteById.notFound });
    };

    await this.repository.deleteById(input.id);
    return { deleted: entity };
  };
};
