import isNill from "@api/common/assertions/is-nill";
import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaFunctionErrors, SchemaFunctionErrorType } from "@api/schemas/domain/schema-functions-errors";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

type SchemasFunctionsTypes = {
  [key in SchemasFunctions] : Function;
}

class SchemasBopsFunctions implements SchemasFunctionsTypes {
  private repository : MetaRepository;

  public async initialize (repository : MetaRepository) : Promise<void> {
    this.repository = repository;
  }

  public async create (input : { entity : CloudedObject })
    : Promise<unknown | SchemaFunctionErrorType> {
    if(isNill(input.entity) || Object.keys(input.entity).length === 0) {
      return ({ errorMessage: SchemaFunctionErrors.create.nullInput });
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
        errorMessage: SchemaFunctionErrors.getById.nullInput,
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

    const insertResult = await this.repository.updateById(input.id, input.valuesToUpdate)
      .catch((result) => { hasError = true; return result; });

    if (hasError) { return { errorMessage: SchemaFunctionErrors.updateById.genericError }; }

    if (Number.isNaN(insertResult.modifiedCount) || insertResult.modifiedCount < 1) {
      notFound = true;
    }

    if (notFound) { return { errorMessage: SchemaFunctionErrors.updateById.notFound }; }

    return { updatedEntity: await this.repository.findById(input.id) };
  }

  public get = null;
  public update = null;
  public delete = null;

  public async deleteById (id : string) : Promise<unknown | SchemaFunctionErrorType> {
    if(isNill(id)) {
      return ({ errorMessage: SchemaFunctionErrors.deleteById.nullInput });
    };

    const entity = await this.repository.findById(id);

    if(isNill(entity)) {
      return ({ errorMessage: SchemaFunctionErrors.deleteById.notFound });
    };

    await this.repository.deleteById(id);
    return { deleted: entity };
  };
};


export const SchemaFunctions = new SchemasBopsFunctions();
