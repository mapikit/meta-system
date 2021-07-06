import { CloudedObject } from "../../../src/common/types/clouded-object";
import { MetaRepository } from "../../../src/common/meta-repository";
import { SchemaManager } from "../../../src/schemas/application/schema-manager";
import { createFakeMongo } from "../../doubles/mongo-server";
import { entityFactory } from "../../factories/entity-factory";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { multipleTypesSchema } from "../../schema/common-schemas/multiple-types-schema";
import { SchemaFunctionErrors } from "../../../src/schemas/domain/schema-functions-errors";

describe("Delete Schema - Schemas Bops Function", () => {
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let deleteFunction : SchemaManager["bopsFunctions"]["delete"];
  let getByIdFunction : SchemaManager["bopsFunctions"]["getById"];
  let repo : MetaRepository;

  beforeEach(async () => {
    fakeClient = await createFakeMongo();
    repo = new MetaRepository(fakeClient);
  });

  it("Deletes Schema using our query model successfully", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    deleteFunction = schemaManager.bopsFunctions.delete;
    getByIdFunction = schemaManager.bopsFunctions.getById;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(multipleTypesSchema.format) as CloudedObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createResult : any = await createEntityFunction({ entity });

    const nameAndHeightQuery = {
      familyBirthdays: { "identical_to": entity.familyBirthdays },
      luckyNumbers: { "contains_higher_or_equal_to": entity.luckyNumbers[0] - 1 },
    };

    const result = await deleteFunction({ query: nameAndHeightQuery });

    expect(result["deletedCount"]).to.not.be.NaN;
    expect(result["deletedCount"]).to.be.equal(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getResult : any = await getByIdFunction({ id: createResult.createdEntity._id });

    expect(getResult.entity).to.be.null;
  });

  it("Fails to delete Schema using our query model [Nothing found]", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    deleteFunction = schemaManager.bopsFunctions.delete;
    getByIdFunction = schemaManager.bopsFunctions.getById;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(multipleTypesSchema.format) as CloudedObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createResult : any = await createEntityFunction({ entity });

    const nameAndHeightQuery = {
      secretBoolSequence: { "size": entity.secretBoolSequence.length + 1 },
    };

    const result = await deleteFunction({ query: nameAndHeightQuery });

    expect(result["deletedCount"]).to.not.be.NaN;
    expect(result["deletedCount"]).to.be.equal(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getResult : any = await getByIdFunction({ id: createResult.createdEntity._id });

    expect(getResult.entity).to.be.deep.equal(entity);
  });

  it("Fails to delete - Invalid Query", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;
    deleteFunction = schemaManager.bopsFunctions.delete;

    const nameAndHeightQuery = {
      name: { "-----": [] },
    };

    const result = await deleteFunction({ query: nameAndHeightQuery });

    expect(result["deletedCount"]).to.be.undefined;
    expect(result["deleteError"]).to.be.deep.equal(SchemaFunctionErrors.delete.invalidQueryArgument);
  });
});
