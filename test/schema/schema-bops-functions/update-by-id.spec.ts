import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";
import { entityFactory } from "@test/factories/entity-factory";
import { schemaFactory } from "@test/factories/schema-factory";
import * as create from "@api/schemas/application/schema-bops-funtions/create-function/index";
import * as updateById from "@api/schemas/application/schema-bops-funtions/update-by-id/index";
import { random } from "faker";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { expect } from "chai";
import { SchemaFunctionErrors } from "@api/schemas/domain/schema-functions-errors";

const randomPartialObject = (fromSchema : SchemasType) : CloudedObject => {
  const resultObject : CloudedObject = {};
  const computedEntity = entityFactory(fromSchema.format);

  for (const propertyName in computedEntity) {
    if (random.boolean) {
      resultObject[propertyName] = computedEntity[propertyName];
    }
  }

  return resultObject;
};

describe("Update By Id - Schema BOPs function", () => {
  const schema = schemaFactory({});

  beforeEach(async () => {
    await SchemaFunctions.repository.initialize(schema, "fakeSystem");
  });

  it("Updates a schema in the Database", async () => {
    const entity : CloudedObject  = entityFactory(schema.format) as CloudedObject;
    const createResult = await create.main({ entity });
    const resultId = createResult["createdEntity"]._id;

    const createClone = Object.assign({}, createResult);

    const partialChange : CloudedObject = randomPartialObject(schema);

    const result = await updateById.main({ id: resultId, valuesToUpdate: partialChange });

    expect(result["updatedEntity"]._id).be.equal(resultId);

    for (const property in partialChange) {
      expect(result["updatedEntity"][property]).to.be
        .equal(partialChange[property], `Property ${property} must be updated to ${partialChange[property]}`);
    }

    expect(createClone).to.not.be.deep.equal(result["updatedEntity"]);
  });

  it("Fails to update due to Null ID", async () => {
    const result = await updateById.main({ id: null, valuesToUpdate: {} });

    expect(result["updatedEntity"]).be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.updateById.nullInput);
  });

  it("Fails to update due to ID Not found", async () => {
    const result = await updateById.main({ id: random.alphaNumeric(15), valuesToUpdate: {} });

    expect(result["updatedEntity"]).be.undefined;
    expect(result["errorMessage"]).to.be.deep.equal(SchemaFunctionErrors.updateById.notFound);
  });
});
