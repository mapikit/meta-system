/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { schemaFactory } from "@test/factories/schema-factory";
import { entityFactory } from "@test/factories/entity-factory";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import faker from "faker";
import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/common/meta-repository";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { MongoClient, ObjectId } from "mongodb";
import { SchemaManager } from "@api/schemas/application/schema-manager";

const expect = chai.expect;
describe("Bops Function - Delete by Id", () => {
  const schema = schemaFactory({});
  let fakeClient : MongoClient;
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;
  let createEntityFunction : SchemaManager["bopsFunctions"]["create"];
  let deleteFunction : SchemaManager["bopsFunctions"]["deleteById"];

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
    deleteFunction = schemaManager.bopsFunctions.deleteById;
  });

  it("Successfully deletes entity", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;

    const createdEntity = (await createEntityFunction({ entity }))["createdEntity"];
    const result = await deleteFunction({ id: createdEntity["_id"] });
    expect(result["deleted"]).not.to.be.undefined;
    expect(result["deleted"]._id).to.be.deep.equal(createdEntity["_id"]);
    const foundAfterDeletion =
      fakeClient.db("fakeSystem")
        .collection(schema.name)
        .findOne({ _id: new ObjectId(createdEntity["_id"]) });

    expect(foundAfterDeletion).to.be.empty;
  });

  it("Fails to delete entity - entity not found", async () => {
    const fakeId = faker.random.alphaNumeric(12);

    const result = await deleteFunction({ id:  fakeId });

    expect(result["deleted"]).to.be.undefined;
    expect(result["deleteError"]).to.be.deep.equal(SchemaFunctionErrors.deleteById.notFound);
  });

  it("Fails to delete entity - no id given", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;
    await createEntityFunction({ entity });
    const result = await deleteFunction({ id : undefined });
    expect(result["deleted"]).to.be.undefined;
    expect(result["deleteError"]).to.be.deep.equal(SchemaFunctionErrors.deleteById.nullInput);
  });
});
