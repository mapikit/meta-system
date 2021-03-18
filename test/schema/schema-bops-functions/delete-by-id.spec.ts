/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { schemaFactory } from "@test/factories/schema-factory";
import * as deleteById from "@api/schemas/application/schema-bops-funtions/delete-by-id/index";
import * as create from "@api/schemas/application/schema-bops-funtions/create-function/index";
import { entityFactory } from "@test/factories/entity-factory";
import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import faker from "faker";
import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { MongoClient, ObjectId } from "mongodb";

const expect = chai.expect;
describe("Bops Function - Delete by Id", () => {
  const schema = schemaFactory({});
  let fakeClient : MongoClient;

  beforeEach(async () => {
    fakeClient = await createFakeMongo();
    const repo = new MetaRepository(fakeClient);
    await SchemaFunctions.initialize(repo);
    await repo.initialize(schema, "fakeSystem");
  });

  it("Successfully deletes entity", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;
    const createdEntity = (await create.main({ entity }))["createdEntity"];
    const result = await deleteById.main({ id: createdEntity["_id"] });
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
    const result = await deleteById.main({ id:  fakeId });
    expect(result["deleted"]).to.be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.deleteById.notFound);
  });

  it("Fails to delete entity - no id given", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;
    await create.main({ entity });
    const result = await deleteById.main({ id : undefined });
    expect(result["deleted"]).to.be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.deleteById.nullInput);
  });
});
