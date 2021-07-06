import { entityFactory } from "../../factories/entity-factory";
import { schemaFactory } from "../../factories/schema-factory";
import { expect } from "chai";
import { random } from "faker";
import { SchemaFunctionErrors } from "../../../src/schemas/domain/schema-functions-errors";
import { CloudedObject } from "../../../src/common/types/clouded-object";
import { MetaRepository } from "../../../src/common/meta-repository";
import { createFakeMongo } from "../../doubles/mongo-server";
import isNill from "../../../src/common/assertions/is-nill";
import { SchemaManager } from "../../../src/schemas/application/schema-manager";
import { MongoClient } from "mongodb";

describe("Schemas BOPS functions - Get By ID", () => {
  const schema = schemaFactory({});
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let getByIdFunction : SchemaManager["bopsFunctions"]["getById"];

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
    getByIdFunction = schemaManager.bopsFunctions.getById;
  });

  it("Successfully gets an existing Schema from the DB", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;
    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];

    const result = await getByIdFunction({ id: createdEntity["_id"] });

    expect(result["found"]).be.true;
    expect(result["entity"]._id).to.be.deep.equal(createdEntity["_id"]);
  });

  it("Gets no Schema", async () => {
    const result = await getByIdFunction({ id: random.alphaNumeric(12) });

    expect(result["found"]).be.false;
    expect(isNill(result["entity"])).to.be.true;
  });

  it("Fails to execute", async () => {
    const result = await getByIdFunction({ id: null });

    expect(result["found"]).be.false;
    expect(result["entity"]).to.be.undefined;
    expect(result["getError"]).to.be.equal(SchemaFunctionErrors.getById["nullInput"]);
  });
});
