
import { DeserializeSchemasCommand } from "../../src/configuration/schemas/de-serialize-schemas";
import { expect } from "chai";
import { ObjectDefinition } from "@meta-system/object-definition";

/* eslint-disable @typescript-eslint/no-var-requires */
const configurationExample = require("./test-data/configuration-example.json");
const deepObjectSchema = require("./test-data/schema/deep-object-schema.json");
const arraysSchema = require("./test-data/schema/array-types-schema.json");
const missingRefNameSchema =
  require("./test-data/schema/missing-reference-schema.json");
/* eslint-enable @typescript-eslint/no-var-requires */

describe("Schemas De-Serializer", () => {
  it("Desserializes schemas correctly formatted", () => {
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

    const reallyDeepProperty = ((schema.format.twoLevelDeepProperty as unknown as ObjectDefinition)
      .subtype["nestedDeepProperty"] as ObjectDefinition).subtype["reallyDeepNestedProp"];

    expect(reallyDeepProperty).to.not.be.undefined;
  });

  it ("Desserializes schema with array types", () => {
    const command = new DeserializeSchemasCommand();

    command.execute(arraysSchema["schemas"]);

    expect(command.resultSchemas.length).to.be.equal(2);
    // This would throw if failed so no more assertions are needed
  });

  it("Does not desserialize schema with missing references (THROWS)", () => {
    const command = new DeserializeSchemasCommand();

    const commandExecution = () : void => {
      command.execute(missingRefNameSchema["schemas"]);
    };

    expect(commandExecution).to.throw;
  });
});
