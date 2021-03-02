/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { schemaFactory } from "@test/factories/schema-factory";
import * as create from "@api/schemas/application/schema-bops-funtions/create-function/index";
import { entityFactory } from "@test/factories/entity-factory";
import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import { CloudedObject } from "@api/common/types/clouded-object";

const expect = chai.expect;

describe("Bops Function - Create", () => {
  const schema = schemaFactory({});

  beforeEach(async () => {
    await SchemaFunctions.repository.initialize(schema, "fakeSystem");
  });

  it("Successfully creates entity", async () => {
    const entity : CloudedObject  = entityFactory(schema.format) as CloudedObject;
    const result = await create.main({ entity });
    expect(result["createdEntity"]._id).not.to.be.undefined;
    delete result["createdEntity"]._id; // The entity generated with "entityFactory" does not contain an Id
    expect(result["createdEntity"]).to.be.deep.equal(entity);
  });

  it("Fails to creates entity - Null input", async () => {
    const createdEntity = await create.main({ entity: undefined });
    expect(createdEntity["errorMessage"]).not.to.be.undefined;
    expect(createdEntity["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.create.nullInput);
  });
});
