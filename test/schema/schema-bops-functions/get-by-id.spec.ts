import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";
import { entityFactory } from "@test/factories/entity-factory";
import { schemaFactory } from "@test/factories/schema-factory";
import * as getById from "@api/schemas/application/schema-bops-funtions/get-by-id-function/index";
import * as create from "@api/schemas/application/schema-bops-funtions/create-function/index";
import { expect } from "chai";
import { random } from "faker";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";


describe("Schemas BOPS functions - Get By ID", () => {
  const schema = schemaFactory({});

  beforeEach(async () => {
    await SchemaFunctions.repository.initialize(schema, "fakeSystem");
  });

  it("Successfully gets an existing Schema from the DB", async () => {
    const entity = entityFactory(schema.format);
    const createdEntity = (await create.main(entity as Record<string, unknown>))["createdEntity"];

    const result = await getById.main({ entityId: createdEntity["_id"] });

    expect(result["found"]).be.true;
    expect(result["entity"]._id).to.be.equal(createdEntity["_id"]);
  });

  it("Gets no Schema", async () => {
    const result = await getById.main({ entityId: random.alphaNumeric(10) });

    expect(result["found"]).be.false;
    expect(result["entity"]).to.be.undefined;
  });

  it("Fails to execute", async () => {
    const result = await getById.main({ entityId: null });

    expect(result["found"]).be.false;
    expect(result["entity"]).to.be.undefined;
    expect(result["getError"]).to.be.equal(SchemaFunctionErrors.getById["nullInput"]);
  });
});
