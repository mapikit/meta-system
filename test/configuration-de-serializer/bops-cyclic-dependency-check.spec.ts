import { BopsCyclicDependencyCheck } from "../../src/configuration/business-operations/cyclic-dependency-check";
import BopsDependencyLoop from "./test-data/configuration/bops-dependency-loop.json";
import BopsDependencyNoLoop from "./test-data/configuration/bops-dependency-no-loop.json";
import { expect } from "chai";

describe("BOps Cyclic Dependency Check", () => {
  it("Fails to execute when there is cyclic dependency", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkDependencies = new BopsCyclicDependencyCheck(BopsDependencyLoop["businessOperations"] as any);

    const evaluator = () : void => { checkDependencies.checkAllBops(); };

    expect(evaluator).to.throw();
  });

  it ("Passes when there is no cyclic dependency", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkDependencies = new BopsCyclicDependencyCheck(BopsDependencyNoLoop["businessOperations"] as any);

    const evaluator = () : void => { checkDependencies.checkAllBops(); };

    expect(evaluator).to.not.throw();
  });
});
