import { testThrow } from "../helpers/test-throw.js";
import { importJsonAndParse } from "../../src/common/helpers/import-json-and-parse.js";
import { BusinessOperation } from "../../src/configuration/business-operations/business-operation.js";
import { BopsCyclicDependencyCheck } from "../../src/configuration/business-operations/cyclic-dependency-check.js";
import { ValidateBopsPipelineFlowCommand } from
  "../../src/configuration/business-operations/validate-bops-pipeline-flow.js";
import { expect } from "chai";
import { BusinessOperationType } from "../../src/configuration/business-operations/business-operations-type.js";

describe("Configuration Manual Validations", () => {
  // Type validations are done by Object Definitions
  // This file tests validations such as if the required functions
  // exists, or if the schema was actually declared, etc.

  describe("BOps Flow", () => {
    it ("Validation fails for dependency cycle within BOps modules", async () => {
      const unparsedBop = (await importJsonAndParse("./test/configuration/test-data/bops/configuration-loop.json"))
        ["businessOperations"][0];
      const bop = new BusinessOperation(unparsedBop);
      const checker = new ValidateBopsPipelineFlowCommand();

      const execution = testThrow(() => checker.execute(bop));
      expect(execution.thrown).to.be.true;
      expect(execution.error.message).to.include("Circular dependency");
    });
    it ("Validation fails for requiring a key that does not exist", async () => {
      const unparsedBop = (await importJsonAndParse("./test/configuration/test-data/bops/missing-key.json"))
        ["businessOperations"][0];
      const bop = new BusinessOperation(unparsedBop);
      const checker = new ValidateBopsPipelineFlowCommand();

      const execution = testThrow(() => checker.execute(bop));
      expect(execution.thrown).to.be.true;
      expect(execution.error.message).to.include("Unmapped dependency modules found at BOPS");
    });
    it ("Validation fails for duplicate keys", async () => {
      const unparsedBop = (await importJsonAndParse("./test/configuration/test-data/bops/duplicate-key.json"))
        ["businessOperations"][0];
      const bop = new BusinessOperation(unparsedBop);
      const checker = new ValidateBopsPipelineFlowCommand();

      const execution = testThrow(() => checker.execute(bop));
      expect(execution.thrown).to.be.true;
      expect(execution.error.message).to.include("Duplicate keys in Bop");
    });
    it ("Validation fails for not having an output", async () => {
      const unparsedBop = (await importJsonAndParse("./test/configuration/test-data/bops/no-output.json"))
        ["businessOperations"][0];
      const bop = new BusinessOperation(unparsedBop);
      const checker = new ValidateBopsPipelineFlowCommand();

      const execution = testThrow(() => checker.execute(bop));
      expect(execution.thrown).to.be.true;
      expect(execution.error.message).to.include(" has no output function");
    });
  });

  describe("BOps dependencies", () => {
    it ("Validation fails for Cyclic dependency with multiple BOps", async () => {
      const unparsedBops : Array<BusinessOperationType> = (await importJsonAndParse(
        "./test/configuration/test-data/configuration/bops-dependency-loop.json"))
        ["businessOperations"];
      const bops = unparsedBops.map((item) => new BusinessOperation(item));
      const checker = new BopsCyclicDependencyCheck(bops);

      const execution = testThrow(() => checker.checkAllBops());
      expect(execution.thrown).to.be.true;
      expect(execution.error.message).to.include("Cannot run a BOp with a cyclic dependecy");
    });
  });
});
