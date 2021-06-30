import { ResolvedConstants } from "@api/bops-functions/bops-engine/static-info-validation";
import { BusinessOperations, Dependency } from "@api/configuration/business-operations/business-operations-type";
import constants from "@api/common/constants";
import { MappedFunctions } from "@api/bops-functions/bops-engine/modules-manager";
import { ObjectResolver } from "./object-manipulator";
import { addTimeout } from "./add-timeout";

type RelevantBopInfo = {
  constants : ResolvedConstants;
  config : BusinessOperations["configuration"];
  results : Map<number, unknown>;
}

export class BopsEngine {
  private readonly constants : Record<string, ResolvedConstants>;
  private readonly mappedFunctions : MappedFunctions;

  constructor (options : {
    MappedFunctions : MappedFunctions;
    MappedConstants : Record<string, ResolvedConstants>;
  }) {
    this.constants = options.MappedConstants;
    this.mappedFunctions = options.MappedFunctions;
  }

  public stitch (operation : BusinessOperations, msTimeout = constants.ENGINE_TTL) : Function {
    const output = operation.configuration.find(module => module.moduleRepo.startsWith("%"));

    const workingBopContext : RelevantBopInfo = {
      config: operation.configuration,
      constants: this.constants[operation.name],
      results : new Map<number, unknown>(),
    };

    const stiched = async (_inputs : Record<string, unknown>) : Promise<unknown> => {
      return Object.assign(await this.getInputs(output.dependencies, workingBopContext, _inputs));
    };
    return addTimeout(msTimeout, stiched);
  }

  private async getInputs (inputs : Dependency[], currentBop : RelevantBopInfo, _inputs : object) : Promise<object> {
    const resolved = new Array<object>();
    for(const input of inputs) {
      if(typeof input.origin === "string") resolved.push(this.solveStaticInput(input, currentBop, _inputs));
      if(typeof input.origin === "number") resolved.push(await this.solveModularInput(input, currentBop, _inputs));
    }

    return ObjectResolver.flattenObject(Object.assign({}, ...resolved));
  }

  // eslint-disable-next-line max-lines-per-function
  private async solveModularInput (
    input : Dependency,
    currentBop : RelevantBopInfo,
    _inputs : object) : Promise<object> {
    const dependency = currentBop.config.find(module => module.key === input.origin);
    const moduleFunction = this.mappedFunctions.get(dependency.moduleRepo);
    const [origin, ...paths] = input.originPath.split(".");
    const resolvedInputs = await this.getInputs(dependency.dependencies, currentBop, _inputs);

    if(origin === "result") {
      const results = currentBop.results.get(dependency.key) ?? await moduleFunction(resolvedInputs);
      currentBop.results.set(dependency.key, results);
      return { [input.targetPath]: ObjectResolver.extractProperty(results, paths) };
    }

    if(origin === "module") {
      const wrappedFunction = this.wrapFunction(moduleFunction, resolvedInputs, paths);
      return { [input.targetPath]: wrappedFunction };
    }

    if(origin === undefined) {
      await moduleFunction(await this.getInputs(dependency.dependencies, currentBop, _inputs));
      return;
    }

    throw new Error("Incorrect originPath configuration");
  }

  private solveStaticInput (
    input : Dependency, currentBop : RelevantBopInfo, _inputs : object) : object {
    switch (input.origin) {
      case "constants":
        const foundConstant = currentBop.constants[input.originPath];
        return { [input.targetPath]: foundConstant };
      case "inputs":
        return { [input.targetPath]: _inputs[input.originPath] };
    }
  }

  private wrapFunction (fn : Function, params : unknown, path : string[]) : () => Promise<unknown> {
    return async function () : Promise<unknown> {
      return ObjectResolver.extractProperty(await fn(params), path);
    };
  };
};
