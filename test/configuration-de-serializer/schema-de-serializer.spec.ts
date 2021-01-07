require("module-alias/register");
import { DeserializeSchemasCommand } from "@api/configuration-de-serializer/domain/commands/de-serialize-schemas";
import { SchemaTypeDefinitionObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { expect } from "chai";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("@test/configuration-de-serializer/test-data/configuration-example.json");
const deepObjectSchema = require("@test/configuration-de-serializer/test-data/schema/deep-object-schema.json");
const arraysSchema = require("@test/configuration-de-serializer/test-data/schema/array-types-schema.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Schemas De-Serializer", () => {
  it("Desserializes schemas correctly formated", () => {
    const command = new DeserializeSchemasCommand();

    command.execute(configurationExample["schemas"]);

    expect(command.resultSchemas.length).to.be.above(0);
  });

  it("Desserializes schema with deep nested properties", () => {
    const command = new DeserializeSchemasCommand();

    command.execute(deepObjectSchema["schemas"]);

    expect(command.resultSchemas.length).to.be.equal(1);
    const schema = command.resultSchemas[0];

    expect(schema.format["oneLevelDeepProperty"]["type"] === "object").to.to.true;
    expect(schema.format["twoLevelDeepProperty"]["type"] === "object").to.to.true;

    const reallyDeepProperty = ((schema.format.twoLevelDeepProperty as SchemaTypeDefinitionObject)
      .data["nestedDeepProperty"] as SchemaTypeDefinitionObject).data["reallyDeepNestedProp"];

    expect(reallyDeepProperty).to.not.be.undefined;
  });

  it ("Desserializes schema with array types", () => {
    const command = new DeserializeSchemasCommand();

    command.execute(arraysSchema["schemas"]);
  });
});
