import { BusinessOperations } from "./business-operations-type";

export class BopsCyclicDependencyCheck {
  public constructor (
    private businessOperations : BusinessOperations[],
  ) {}

  public checkAllBops () : void {
    this.businessOperations.forEach((bops) => {
      this.checkBopDependencyChain(bops.name);
    });
  }

  public checkBopDependencyChain (bopsName : string, requireChain : string[] = []) : void {
    if (requireChain.includes(bopsName)) {
      throw Error("Cannot run a BOp with a cyclic dependecy: " + requireChain.join(", "));
    }

    requireChain.push(bopsName);

    const currentDependencies = this.getBopsDependencies(bopsName);
    currentDependencies.forEach((dependency) => {
      this.checkBopDependencyChain(dependency, requireChain);
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
        result.push(config.moduleRepo);
      }
    });

    return result;
  }

  private getBopsByName (bopsName : string) : BusinessOperations | undefined {
    return this.businessOperations.find((bops) => bops.name === bopsName);
  }
}
