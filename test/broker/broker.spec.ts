import { expect } from "chai";
import { FunctionsContext } from "../../src/entities/functions-context.js";
import faker from "faker";
import constants from "../../src/common/constants.js";
import { DiffManager } from "../../src/configuration/diff/diff-manager.js";
const { random } = faker;

describe("Broker Tests", () => {
  const diffManager = new DiffManager();

  it("Functions context broker", () => {
    const factory = new FunctionsContext(diffManager);
    const broker = factory.createBroker([], constants.RUNTIME_ENGINE_IDENTIFIER);

    // Would throw if not found
    broker["logger"]["fatal"]("NOT AN ERROR, THIS IS A TEST");
  });

  it("Functions Context Broker - Declaring and retrieving functions", () => {
    const factory = new FunctionsContext(diffManager);
    const broker = factory.createBroker([{ entity: "schemaFunctions",
      permissions: ["set_functions", "get_functions"] }], constants.RUNTIME_ENGINE_IDENTIFIER);

    let myVariable = 0;
    const aFunction = (value : number) : void => { myVariable = value; };
    broker.schemaFunctions.setSchemaFunction("mySchema", aFunction,
      { functionName: "nn" },
    );

    const myFunction = broker.schemaFunctions.getSchemaFunction("nn", "mySchema");
    expect(myFunction).to.be.equal(aFunction);

    const newValue = random.number(100);
    myFunction(newValue);
    expect(myVariable).to.be.equal(newValue);
  });
});

