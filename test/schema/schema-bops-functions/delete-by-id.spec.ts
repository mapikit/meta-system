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

const expect = chai.expect;
describe("Bops Function - Delete by Id", () => {
  const schema = schemaFactory({});

  beforeEach(async () => {
    await SchemaFunctions.repository.initialize(schema, "fakeSystem");
  });

  it("Successfully deletes entity", async () => {
    const entity = entityFactory(schema.format);
    const createdEntity = (await create.main(entity as Record<string, unknown>))["createdEntity"];
    const result = await deleteById.main({ id: createdEntity["_id"] });
    expect(result["deleted"]).not.to.be.undefined;
    expect(result["deleted"]._id).to.be.equal(createdEntity["_id"]);
  });

  it("Fails to delete entity - entity not found", async () => {
    const fakeId = faker.random.alphaNumeric(12);
    const result = await deleteById.main({ id:  fakeId });
    expect(result["deleted"]).to.be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.deleteById);
  });

  it("Fails to delete entity - no id given", async () => {
    const entity = entityFactory(schema.format);
    await create.main(entity as Record<string, unknown>);
    const result = await deleteById.main({ id : undefined });
    expect(result["deleted"]).to.be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.deleteById);
  });
});
