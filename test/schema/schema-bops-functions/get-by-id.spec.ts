import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";
import { entityFactory } from "@test/factories/entity-factory";
import { schemaFactory } from "@test/factories/schema-factory";
import * as getById from "@api/schemas/application/schema-bops-funtions/get-by-id-function/index";
import * as create from "@api/schemas/application/schema-bops-funtions/create-function/index";
import { expect } from "chai";
import { random } from "faker";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";
import { CloudedObject } from "@api/common/types/clouded-object";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { createFakeMongo } from "@test/doubles/mongo-server";
import isNill from "@api/common/assertions/is-nill";

describe("Schemas BOPS functions - Get By ID", () => {
  const schema = schemaFactory({});

  beforeEach(async () => {
    const fakeClient = await createFakeMongo();
    const repo = new MetaRepository(fakeClient);
    await SchemaFunctions.initialize(repo);
    await repo.initialize(schema, "fakeSystem");
  });

  it("Successfully gets an existing Schema from the DB", async () => {
    const entity = entityFactory(schema.format) as CloudedObject;
    const createdEntity = (await create.main({ entity }))["createdEntity"];

    const result = await getById.main({ id: createdEntity["_id"] });

    expect(result["found"]).be.true;
    expect(result["entity"]._id).to.be.deep.equal(createdEntity["_id"]);
  });

  it("Gets no Schema", async () => {
    const result = await getById.main({ id: random.alphaNumeric(12) });

    expect(result["found"]).be.false;
    expect(isNill(result["entity"])).to.be.true;
  });

  it("Fails to execute", async () => {
    const result = await getById.main({ id: null });

    expect(result["found"]).be.false;
    expect(result["entity"]).to.be.undefined;
    expect(result["errorMessage"]).to.be.equal(SchemaFunctionErrors.getById["nullInput"]);
  });
});
