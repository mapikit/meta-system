import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaManager } from "@api/schemas/application/schema-manager";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { entityFactory } from "@test/factories/entity-factory";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { complexExampleSchema } from "@test/schema/common-schemas/complex-example-schema";
import { flatExampleSchema } from "@test/schema/common-schemas/flat-example-schema";
import { deepExampleSchema } from "@test/schema/common-schemas/deep-example-schema";

describe("Get Schema - Schemas Bops Function", () => {
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let getFunction : SchemaManager["bopsFunctions"]["get"];
  let repo : MetaRepository;

  beforeEach(async () => {
    fakeClient = await createFakeMongo();
    repo = new MetaRepository(fakeClient);
  });

  it("Gets Flat Schema using our query model successfully", async () => {
    // Setup
    await repo.initialize(flatExampleSchema, systemName);

    schemaManager = new SchemaManager({
      schema: flatExampleSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = flatExampleSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    const entity = entityFactory(flatExampleSchema.format) as CloudedObject;
    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];

    const nameAndHeightQuery = {
      name: { "equal_to": entity.name, "exists": true },
      height: { "greater_than": (entity.height as number) - 10 },
    };

    const result = await getFunction(nameAndHeightQuery);

    expect(Array.isArray(result["entities"])).be.true;
    expect(result["entities"][0]._id).to.be.deep.equal(createdEntity["_id"]);
  });

  it("Gets Deep Schema using our query model successfully", async () => {
    // Setup
    await repo.initialize(deepExampleSchema, systemName);

    schemaManager = new SchemaManager({
      schema: deepExampleSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = deepExampleSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    const entity = entityFactory(deepExampleSchema.format) as CloudedObject;
    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];

    const nameAndJobDeepQuery = {
      name: { "equal_to": entity.name },
      job: {
        wage: { "greater_than": (entity.job as { wage : number }).wage - 1 },
        hiredAt: { "lower_or_equal_to": (entity.job as SchemaObject).hiredAt },
      },
    };

    const result = await getFunction(nameAndJobDeepQuery);

    expect(Array.isArray(result["entities"])).be.true;
    expect(result["entities"][0]._id).to.be.deep.equal(createdEntity["_id"]);
  });

  it("Gets Complex Schema using our query model successfully", async () => {
    // Setup
    await repo.initialize(complexExampleSchema, systemName);

    schemaManager = new SchemaManager({
      schema: complexExampleSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = complexExampleSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(complexExampleSchema.format) as CloudedObject;
    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];

    const nameAndAcquaintancesComplexQuery = {
      name: { "equal_to": entity.name },
      hobbies: { "contains_all": entity.hobbies },
      acquaintances: { "contains": {
        name: entity.acquaintances[0].name,
        age: entity.acquaintances[0].age,
        gender: entity.acquaintances[0].gender,
      } },
    };

    const result = await getFunction(nameAndAcquaintancesComplexQuery);

    expect(Array.isArray(result["entities"])).be.true;
    expect(result["entities"][0]._id).to.be.deep.equal(createdEntity["_id"]);
  });

  it("Fails to get Schema", async () => {
    // Setup
    await repo.initialize(complexExampleSchema, systemName);

    schemaManager = new SchemaManager({
      schema: complexExampleSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = complexExampleSchema;
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(complexExampleSchema.format) as CloudedObject;

    const invalidQuery = {
      name: { "equal12314_to": entity.name },
    };

    const result = await getFunction(invalidQuery);

    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.get.invalidSearchArgument);
  });

  it("Gets Complex Schema [contains_all embedded documents] using our query model successfully", async () => {
    // Setup
    await repo.initialize(complexExampleSchema, systemName);

    schemaManager = new SchemaManager({
      schema: complexExampleSchema,
      metaRepository: repo,
      systemName: systemName,
    });

    schemaManager.bopsFunctions.schema = complexExampleSchema;

    createEntityFunction = schemaManager.bopsFunctions.create;
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(complexExampleSchema.format) as CloudedObject;
    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];

    const nameAndAcquaintancesComplexQuery = {
      name: { "equal_to": entity.name },
      acquaintances: { "contains_all": [{
        name: entity.acquaintances[0].name,
        age: entity.acquaintances[0].age,
        gender: entity.acquaintances[0].gender,
      }] },
    };

    const result = await getFunction(nameAndAcquaintancesComplexQuery);

    expect(Array.isArray(result["entities"])).be.true;
    expect(result["entities"][0]._id).to.be.deep.equal(createdEntity["_id"]);
  });
});
