import constants from "../../common/constants";
import { BusinessOperations, Dependency } from "../../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../../configuration/configuration-type";
import { addTimeout } from "./add-timeout";
import { ModuleManager, MappedFunctions } from "./modules-manager";
import { ObjectResolver } from "./object-manipulator";
import { ResolvedConstants } from "./static-info-validation";

type RelevantBopInfo = {
  constants : ResolvedConstants;
  config : BusinessOperations["configuration"];
  results : Map<number, unknown>;
}

export class BopsEngine {
  private readonly constants : Record<string, ResolvedConstants>;
  private readonly moduleManager : ModuleManager;
  private mappedFunctions ?: MappedFunctions;
  private systemConfig : ConfigurationType;

  constructor (options : {
    ModuleManager : ModuleManager;
    MappedConstants : Record<string, ResolvedConstants>;
    SystemConfig : ConfigurationType;
  }) {
    this.constants = options.MappedConstants;
    this.moduleManager = options.ModuleManager;
    this.systemConfig = options.SystemConfig;
  }

  public stitch (operation : BusinessOperations, msTimeout = constants.ENGINE_TTL) : Function {
    this.mappedFunctions = this.moduleManager.resolveSystemModules(this.systemConfig);

    const output = operation.configuration.find(module => module.moduleRepo.startsWith("%"));

    const stiched = async (_inputs : Record<string, unknown>) : Promise<unknown> => {
      const workingBopContext : RelevantBopInfo = {
        config: operation.configuration,
        constants: this.constants[operation.name],
        results : new Map<number, unknown>(),
      };

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

    if(input.originPath === undefined) {
      const inputs = await this.getInputs(dependency.dependencies, currentBop, _inputs);

      await moduleFunction(inputs);
      return;
    }

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
