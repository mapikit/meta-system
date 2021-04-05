import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaManager } from "@api/schemas/application/schema-manager";
// import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { entityFactory } from "@test/factories/entity-factory";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { multipleTypesSchema } from "@test/schema/common-schemas/multiple-types-schema";
import { randomPartialObject } from "@test/schema/random-partial-object";

describe.only("Update Schema - Schemas Bops Function", () => {
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let updateFunction : SchemaManager["bopsFunctions"]["update"];
  let getFunction : SchemaManager["bopsFunctions"]["get"];
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
    getFunction = schemaManager.bopsFunctions.get;

    // Test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity : any = entityFactory(multipleTypesSchema.format) as CloudedObject;
    await createEntityFunction({ entity });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const partialUpdate : any = randomPartialObject(multipleTypesSchema);

    const nameAndHeightQuery = {
      name: { "equal_to": entity.name, "exists": true },
      height: { "greater_than": entity.age - 1 },
    };

    const result = await updateFunction({ newValue: partialUpdate, query: nameAndHeightQuery });

    expect(result["updatedCount"]).to.not.be.NaN;
    expect(result["updatedCount"]).to.be.equal(1);

    const getResult = await getFunction({});
  });
});
