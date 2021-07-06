import { CloudedObject } from "../../../src/common/types/clouded-object";
import { entityFactory } from "../../factories/entity-factory";
import { schemaFactory } from "../../factories/schema-factory";
import { random } from "faker";
import { expect } from "chai";
import { SchemaFunctionErrors } from "../../../src/schemas/domain/schema-functions-errors";
import { MetaRepository } from "../../../src/common/meta-repository";
import { createFakeMongo } from "../../doubles/mongo-server";
import { MongoClient } from "mongodb";
import { SchemaManager } from "../../../src/schemas/application/schema-manager";
import { randomPartialObject } from "../../schema/random-partial-object";

describe("Update By Id - Schema BOPs function", () => {
  const schema = schemaFactory({});
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let updateByIdFunction : SchemaManager["bopsFunctions"]["updateById"];

  beforeEach(async () => {
    fakeClient = await createFakeMongo();
    const repo = new MetaRepository(fakeClient);
    await repo.initialize(schema, systemName);

    schemaManager = new SchemaManager({
      schema,
      metaRepository: repo,
      systemName: systemName,
    });

    createEntityFunction = schemaManager.bopsFunctions.create;
    updateByIdFunction = schemaManager.bopsFunctions.updateById;
  });

  it("Updates a schema in the Database", async () => {
    const entity : CloudedObject  = entityFactory(schema.format) as CloudedObject;
    const createResult = await createEntityFunction({ entity });
    const resultId = createResult["createdEntity"]._id;

    const createClone = Object.assign({}, createResult);

    const partialChange : CloudedObject = randomPartialObject(schema);

    const result = await updateByIdFunction({ id: resultId, valuesToUpdate: partialChange });

    expect(result["updatedEntity"]._id).be.deep.equal(resultId);

    for (const property in partialChange) {
      expect(result["updatedEntity"][property]).to.be.deep
        .equal(partialChange[property], `Property ${property} must be updated to ${partialChange[property]}`);
    }

    expect(createClone).to.not.be.deep.equal(result["updatedEntity"]);
  });

  it("Fails to update due to Null ID", async () => {
    const result = await updateByIdFunction({ id: null, valuesToUpdate: { fake: "property" } });

    expect(result["updatedEntity"]).be.undefined;
    expect(result["updateError"]).to.be.deep.equal(SchemaFunctionErrors.updateById.nullInput);
  });

  it("Fails to update due to ID Not found", async () => {
    const result = await updateByIdFunction({ id: random.alphaNumeric(12), valuesToUpdate: { fake: "property" } });

    expect(result["updatedEntity"]).be.undefined;
    expect(result["updateError"]).to.be.deep.equal(SchemaFunctionErrors.updateById.notFound);
  });
});
