import { BusinessOperations } from "./business-operations-type.js";

export class BopsCyclicDependencyCheck {
  public constructor (
    private businessOperations : BusinessOperations[],
  ) {}

  public checkAllBops () : void {
    this.businessOperations.forEach((bops) => {
      this.checkBopDependencyChain(bops.name);
    });
  }

  public checkBopDependencyChain (
    initialBopsName : string, requireChain : string[] = [], currentDependencyName ?: string) : void {
    if (requireChain.includes(initialBopsName)) {
      throw Error("Cannot run a BOp with a cyclic dependecy: " + requireChain.join(", "));
    }

    if (currentDependencyName !== undefined) requireChain.push(currentDependencyName);

    const currentDependencies = this.getBopsDependencies(
      currentDependencyName === undefined ? initialBopsName : currentDependencyName,
    );

    currentDependencies.forEach((dependency) => {
      this.checkBopDependencyChain(initialBopsName, requireChain, dependency);
    });
  }

  private getBopsDependencies (bopsName : string) : string[] {
    const result = [];

    const bops = this.getBopsByName(bopsName);

    if (bops === undefined) {
      return [];
    }

    bops.configuration.forEach((config) => {
      if (config.moduleType === "bop") {
        result.push(config.moduleName);
      }
    });

    return result;
  }

  private getBopsByName (bopsName : string) : BusinessOperations | undefined {
    return this.businessOperations.find((bops) => bops.name === bopsName);
  }
}
