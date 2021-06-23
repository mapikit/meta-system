import "module-alias/register";

import { ResolvedConstants } from "@api/bops-functions/bops-engine/static-info-validation";
import { BusinessOperations, Dependency } from "@api/configuration/business-operations/business-operations-type";
import constants from "@api/common/constants";
import { MappedFunctions } from "@api/bops-functions/bops-engine/modules-manager";
import { ObjectResolver } from "./object-manipulator";
import { addTimeout } from "./timer";

type RelevantBopInfo = {
  constants : ResolvedConstants;
  config : BusinessOperations["configuration"];
}

export class BopsEngine {
  private readonly constants : Record<string, ResolvedConstants>;
  private readonly mappedFunctions : MappedFunctions;
  private readonly bopsConfigs : BusinessOperations[];
  private workingBopContext : RelevantBopInfo;

  constructor (options : {
    MappedFunctions : MappedFunctions;
    MappedConstants : Record<string, ResolvedConstants>;
    BopsConfigs : BusinessOperations[];
  }) {
    this.constants = options.MappedConstants;
    this.mappedFunctions = options.MappedFunctions;
    this.bopsConfigs = options.BopsConfigs;
  }

  public stich (operation : BusinessOperations) : Function {
    this.mapInternalBOps(operation);
    const output = operation.configuration.find(module => module.moduleRepo.startsWith("%"));

    this.workingBopContext = {
      config: operation.configuration,
      constants: this.constants[operation.name],
    };

    const stiched = async (_inputs : object) : Promise<unknown> => {
      return Object.assign(await this.getInputs(output.dependencies, _inputs));
    };

    return addTimeout(constants.ENGINE_TTL, stiched);
  }

  private mapInternalBOps (currentBop : BusinessOperations) : void {
    currentBop.configuration.forEach(module => {
      const isInternalBop = module.moduleRepo.startsWith("+");
      if(isInternalBop && !this.mappedFunctions.has(module.moduleRepo)) {
        const refBop = this.bopsConfigs.find(bop => bop.name === module.moduleRepo.slice(1));
        this.mappedFunctions.set(module.moduleRepo, this.stich(refBop));
      }
    });
  }

  private async getInputs (inputs : Dependency[], _inputs : object) : Promise<object> {
    const inputsArray = inputs.map(async input => {
      if(typeof input.origin === "string") return this.solveStaticInput(input, _inputs);
      if (typeof input.origin === "number") return this.solveModularInput(input, _inputs);
    });

    const resolved = await Promise.all(inputsArray);
    return ObjectResolver.flattenObject(Object.assign({}, ...resolved));
  }

  // eslint-disable-next-line max-lines-per-function
  private async solveModularInput (input : Dependency, _inputs : object) : Promise<object> {
    const dependency = this.workingBopContext.config.find(module => module.key === input.origin);
    const funct = this.mappedFunctions.get(dependency.moduleRepo.slice(1));
    const path = input.originPath.slice(7);
    const resolvedInputs = await this.getInputs(dependency.dependencies, _inputs);
    if(input.originPath.startsWith("result")) {
      const results = await funct(resolvedInputs);
      return { [input.targetPath]: ObjectResolver.extractProperty(results, path) };
    }
    if(input.originPath.startsWith("module")) {
      const wrappedFunction = this.wrapFunction(funct, resolvedInputs, path);
      return { [input.targetPath]: wrappedFunction };
    }
    if(input.originPath === undefined) {
      await funct(await this.getInputs(dependency.dependencies, _inputs));
      return;
    }
  }

  private solveStaticInput (input : Dependency, _inputs : object) : object  {
    switch (input.origin) {
      case "constants":
        const foundConstant = this.workingBopContext.constants[input.originPath];
        return { [input.targetPath]: foundConstant };
      case "inputs":
        return { [input.targetPath]: _inputs[input.originPath] };
    }
  }

  private wrapFunction (fn : Function, params : unknown, select : string) : () => Promise<unknown> {
    return async function () : Promise<unknown> {
      return ObjectResolver.extractProperty(await fn(params), select);
    };
  };
};
