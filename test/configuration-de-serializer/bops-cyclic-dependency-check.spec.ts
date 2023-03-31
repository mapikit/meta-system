import { BopsCyclicDependencyCheck } from "../../src/configuration/business-operations/cyclic-dependency-check.js";
import { expect } from "chai";
import { importJsonAndParse } from "../helpers/import-json-and-parse.js";

describe("BOps Cyclic Dependency Check", async () => {
  const BopsDependencyLoop = await importJsonAndParse("./test/configuration-de-serializer/test-data/configuration/bops-dependency-loop.json");
  const BopsDependencyNoLoop = await importJsonAndParse("./test/configuration-de-serializer/test-data/configuration/bops-dependency-no-loop.json");

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
