import { logger } from "../../common/logger/logger.js";
import { BusinessOperationType } from "./business-operations-type.js";

export class BopsCyclicDependencyCheck {
  public constructor (
    private businessOperations : BusinessOperationType[],
  ) {}

  public checkAllBops () : void {
    this.businessOperations.forEach((bops) => {
      this.checkBopDependencyChain(bops.identifier);
    });
  }

  public checkBopDependencyChain (
    initialBopsName : string, requireChain : string[] = [], currentDependencyName ?: string) : void {
    if (requireChain.includes(initialBopsName)) {
      const message = "Cannot run a BOp with a cyclic dependecy: " + requireChain.join(", ");
      logger.error(`[BUSINESS OPERATIONS VALIDATION] - ${message}`);
      throw Error(message);
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

  private getBopsByName (bopsName : string) : BusinessOperationType | undefined {
    return this.businessOperations.find((bops) => bops.identifier === bopsName);
  }
}
