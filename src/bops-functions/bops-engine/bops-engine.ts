import { getObjectProperty } from "../../schemas/application/query-builder/get-object-property";
import constants from "../../common/constants";
import { BopsVariable, BusinessOperations, Dependency }
  from "../../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../../configuration/configuration-type";
import { addTimeout } from "./add-timeout";
import { ModuleManager, MappedFunctions } from "./modules-manager";
import { ObjectResolver } from "./object-manipulator";
import { ResolvedConstants, StaticSystemInfo } from "./static-info-validation";
import { ResolvedVariables, VariableContext } from "./variables/variables-context";

type RelevantBopInfo = {
  constants : ResolvedConstants;
  variables : ResolvedVariables;
  config : BusinessOperations["configuration"];
  results : Map<number, unknown>;
}

export class BopsEngine {
  private readonly constants : Record<string, ResolvedConstants>;
  private readonly variables : Record<string, BopsVariable[]>;
  private readonly moduleManager : ModuleManager;
  private mappedFunctions ?: MappedFunctions;
  private systemConfig : ConfigurationType;

  constructor (options : {
    ModuleManager : ModuleManager;
    SystemConfig : ConfigurationType;
  }) {
    this.constants = StaticSystemInfo.validateSystemStaticInfo(options.SystemConfig);
    this.variables = VariableContext.validateSystemVariables(options.SystemConfig);
    this.moduleManager = options.ModuleManager;
    this.systemConfig = options.SystemConfig;
    console.log(this.variables);
  }

  // eslint-disable-next-line max-lines-per-function
  public stitch (operation : BusinessOperations, msTimeout = constants.ENGINE_TTL) : Function {
    this.mappedFunctions = this.moduleManager.resolveSystemModules(this.systemConfig);

    const output = operation.configuration.find(module => module.moduleType === "output");

    console.log(this.variables[operation.name]);

    const stitched = async (_inputs : Record<string, unknown>) : Promise<unknown> => {
      console.log("Runnin BOp =======================", operation.name);
      const variablesInfo = new VariableContext(this.variables[operation.name]);
      this.mappedFunctions = variablesInfo.appendVariableFunctions(this.mappedFunctions);

      const workingBopContext : RelevantBopInfo = {
        config: operation.configuration,
        constants: this.constants[operation.name],
        variables: variablesInfo.variables,
        results : new Map<number, unknown>(),
      };
      const res = await this.getInputs(output.dependencies, workingBopContext, _inputs);
      console.log("End of BOp =======================", operation.name);

      return res;
    };
    return addTimeout(msTimeout, stitched);
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
    const dependencyName = ModuleManager.getFullModuleName(dependency);
    const moduleFunction = this.mappedFunctions.get(dependencyName);
    const resolvedInputs = await this.getInputs(dependency.dependencies, currentBop, _inputs);

    if(input.originPath === undefined) {
      const result = await moduleFunction(resolvedInputs);
      currentBop.results.set(dependency.key, result);
      return;
    }

    const [origin, ...paths] = input.originPath.split(".");

    if(origin === "result") {
      const results = /*currentBop.results.get(dependency.key) ??*/ await moduleFunction(resolvedInputs);
      //currentBop.results.set(dependency.key, results);
      return { [input.targetPath]: ObjectResolver.extractProperty(results, paths) };
    }

    if(origin === "module") {
      const wrappedFunction = this.wrapFunction(moduleFunction, resolvedInputs, paths);
      return { [input.targetPath]: wrappedFunction };
    }

    throw new Error("Incorrect originPath configuration");
  }

  // eslint-disable-next-line max-lines-per-function
  private solveStaticInput (
    input : Dependency, currentBop : RelevantBopInfo, _inputs : object) : object {
    switch (input.origin) {
      case "constants":
        const foundConstant = currentBop.constants[input.originPath];
        return { [input.targetPath]: foundConstant };
      case "inputs":
        return { [input.targetPath]: getObjectProperty(_inputs, input.originPath) };
      case "variables":
        return { [input.targetPath]: currentBop.variables[input.originPath].value };
      case "constant":
        const constant = currentBop.constants[input.originPath];
        return { [input.targetPath]: constant };
      case "input":
        return { [input.targetPath]: getObjectProperty(_inputs, input.originPath) };
      case "variable":
        return { [input.targetPath]: currentBop.variables[input.originPath].value };
    }
  }

  private wrapFunction (fn : Function, params : unknown, path : string[]) : () => Promise<unknown> {
    return async function () : Promise<unknown> {
      const result = ObjectResolver.extractProperty(await fn(params), path);
      return result;
    };
  };
};
