import { BopsCyclicDependencyCheck } from "../../src/configuration/business-operations/cyclic-dependency-check";
const BopsDependencyLoop = require("./test-data/configuration/bops-dependency-loop.json");
const BopsDependencyNoLoop = require("./test-data/configuration/bops-dependency-no-loop.json");
import { expect } from "chai";

describe.only("BOps Cyclic Dependency Check", () => {
  it("Fails to execute when there is cyclic dependency", () => {
    const checkDependencies = new BopsCyclicDependencyCheck(BopsDependencyLoop["businessOperations"]);

    const evaluator = () : void => { checkDependencies.checkAllBops(); };

    expect(evaluator).to.throw();
  });

  it ("Passes when there is no cyclic dependency", () => {
    const checkDependencies = new BopsCyclicDependencyCheck(BopsDependencyNoLoop["businessOperations"]);

    const evaluator = () : void => { checkDependencies.checkAllBops(); };

    expect(evaluator).to.not.throw();
  });
});
