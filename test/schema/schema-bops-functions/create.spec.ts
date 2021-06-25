/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { schemaFactory } from "@test/factories/schema-factory";
import { entityFactory } from "@test/factories/entity-factory";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/common/meta-repository";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { SchemaManager } from "@api/schemas/application/schema-manager";

const expect = chai.expect;

describe("Bops Function - Create", () => {
  const schema = schemaFactory({});
  const systemName = "fakeSystem";
  let schemaManager : SchemaManager;

  beforeEach(async () => {
    const repo = new MetaRepository(await createFakeMongo());
    await repo.initialize(schema, systemName);

    schemaManager = new SchemaManager({
      schema,
      metaRepository: repo,
      systemName: systemName,
    });
  });

  it("Successfully creates entity", async () => {
    const entity : CloudedObject = entityFactory(schema.format) as CloudedObject;
    const createEntityFunction = schemaManager.bopsFunctions.create;

    const result = await createEntityFunction({ entity });
    expect(result["createdEntity"]._id).not.to.be.undefined;
    expect(result["createdEntity"]).to.be.deep.equal(entity);
  });

  it("Fails to creates entity - Null input", async () => {
    const createEntityFunction = schemaManager.bopsFunctions.create;

    const createdEntity = await createEntityFunction({ entity: undefined });

    expect(createdEntity["createError"]).not.to.be.undefined;
    expect(createdEntity["createError"]).to.be.deep.equal(SchemaFunctionErrors.create.nullInput);
  });
});
