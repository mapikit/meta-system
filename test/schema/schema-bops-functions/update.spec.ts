import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/common/meta-repository";
import { SchemaManager } from "@api/schemas/application/schema-manager";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { entityFactory } from "@test/factories/entity-factory";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { multipleTypesSchema } from "@test/schema/common-schemas/multiple-types-schema";
import { randomPartialObject } from "@test/schema/random-partial-object";
import { random } from "faker";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";

describe("Update Schema - Schemas Bops Function", () => {
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let updateFunction : SchemaManager["bopsFunctions"]["update"];
  let getByIdFunction : SchemaManager["bopsFunctions"]["getById"];
  let repo : MetaRepository;

  beforeEach(async () => {
    fakeClient = await createFakeMongo();
    repo = new MetaRepository(fakeClient);
  });

  it("Updates Schema using our query model successfully", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    updateFunction = schemaManager.bopsFunctions.update;
    getByIdFunction = schemaManager.bopsFunctions.getById;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(multipleTypesSchema.format) as CloudedObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createResult : any = await createEntityFunction({ entity });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const partialUpdate : any = randomPartialObject(multipleTypesSchema);

    const nameAndHeightQuery = {
      name: { "one_of": [entity.name, random.alphaNumeric(4)] },
      height: { "not_equal_to": entity.age - 1 },
    };

    const result = await updateFunction({ valuesToUpdate: partialUpdate, query: nameAndHeightQuery });

    expect(result["updatedCount"]).to.not.be.NaN;
    expect(result["updatedCount"]).to.be.equal(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getResult : any = await getByIdFunction({ id: createResult.createdEntity._id });

    expect(getResult.entity).to.be.deep.equal({ ...entity, ...partialUpdate });
  });

  it("Fails to update Schema using our query model [Nothing found]", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    updateFunction = schemaManager.bopsFunctions.update;
    getByIdFunction = schemaManager.bopsFunctions.getById;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(multipleTypesSchema.format) as CloudedObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createResult : any = await createEntityFunction({ entity });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const partialUpdate : any = randomPartialObject(multipleTypesSchema);

    const nameAndHeightQuery = {
      name: { "not_one_of": [entity.name, random.alphaNumeric(4)] },
    };

    const result = await updateFunction({ valuesToUpdate: partialUpdate, query: nameAndHeightQuery });

    expect(result["updatedCount"]).to.not.be.NaN;
    expect(result["updatedCount"]).to.be.equal(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getResult : any = await getByIdFunction({ id: createResult.createdEntity._id });

    expect(getResult.entity).to.be.deep.equal(entity);
  });

  it("Fails to update - Invalid Query", async () => {
    // Setup
    await repo.initialize(multipleTypesSchema, systemName);

    schemaManager = new SchemaManager({
      schema: multipleTypesSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = multipleTypesSchema;
    updateFunction = schemaManager.bopsFunctions.update;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const partialUpdate : any = randomPartialObject(multipleTypesSchema);

    const nameAndHeightQuery = {
      name: { "-----": [] },
    };

    const result = await updateFunction({ valuesToUpdate: partialUpdate, query: nameAndHeightQuery });

    expect(result["updatedCount"]).to.be.undefined;
    expect(result["updateError"]).to.be.deep.equal(SchemaFunctionErrors.update.invalidQueryArgument);
  });
});
