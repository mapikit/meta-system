import { getObjectProperty } from "../../schemas/application/query-builder/get-object-property";
import constants from "../../common/constants";
import { BusinessOperations, Dependency }
  from "../../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../../configuration/configuration-type";
import { addTimeout } from "./add-timeout";
import { ModuleManager } from "./modules-manager";
import { ObjectResolver } from "./object-manipulator";
import { VariableContext } from "./variables/variables-context";
import { SystemContext } from "./contexts/system-context";
import { BopContext } from "./contexts/bop-context";

/**
 * This is the engine responsible for stitching all the functions in all the BOps in the system
 */
export class BopsEngine {
  private readonly systemContext : SystemContext;

  constructor (options : {
    ModuleManager : ModuleManager;
    SystemConfig : ConfigurationType;
  }) {
    this.systemContext = new SystemContext(options);
  }

  // eslint-disable-next-line max-lines-per-function
  public stitch (operation : BusinessOperations, msTimeout = constants.ENGINE_TTL) : Function {
    this.systemContext.generateMappedFunctions();
    const output = operation.configuration.find(module => module.moduleType === "output");

    const stitched = async (_inputs : Record<string, unknown>) : Promise<unknown> => {
      console.log(">>>>>>>>>>>>>>>>>>>> RUNNING BOP", operation.name);
      const variablesInfo = new VariableContext(this.systemContext.variables[operation.name]);
      const bopContext = new BopContext(
        operation.configuration,
        variablesInfo.variables,
        this.systemContext.constants[operation.name],
        variablesInfo.appendVariableFunctions(this.systemContext.mappedFunctions),
      );

      const res = await this.getInputs(output.dependencies, bopContext, _inputs);

      console.log("<<<<<<<<<<<<<<<<<<<<<<<<< FINISHED BOP", operation.name);
      return res;
    };
    return addTimeout(msTimeout, stitched);
  }

  /** Executes required modules to get the value of inputs */
  private async getInputs (inputs : Dependency[], currentBop : BopContext, _inputs : object) : Promise<object> {
    const resolved = new Array<object>();
    const hasModularDependency = inputs.some((dependency) => dependency.originPath?.startsWith("module"));
    let context = currentBop;

    if (hasModularDependency) {
      context = BopContext.cloneToNewContext(currentBop);
    }

    for(const input of inputs) {
      if(typeof input.origin === "string") resolved.push(this.solveStaticInput(input, currentBop, _inputs));
      if(typeof input.origin === "number") resolved.push(await this.solveModularInput(input, context, _inputs));
    }

    return ObjectResolver.flattenObject(Object.assign({}, ...resolved));
  }

  // eslint-disable-next-line max-lines-per-function
  private async solveModularInput (
    input : Dependency,
    currentBopContext : BopContext,
    _inputs : object) : Promise<object> {
    const dependency = currentBopContext.config.find(module => module.key === input.origin);
    const dependencyName = ModuleManager.getFullModuleName(dependency);
    const moduleFunction = currentBopContext.availableFunctions.get(dependencyName);
    const resolvedInputs = await this.getInputs(dependency.dependencies, currentBopContext, _inputs);

    if(input.originPath === undefined) {
      const result = await moduleFunction(resolvedInputs);
      currentBopContext.results.set(dependency.key, result);
      return;
    }

    const [origin, ...paths] = input.originPath.split(".");

    if(origin === "result") {
      const results = currentBopContext.results.get(dependency.key) ?? await moduleFunction(resolvedInputs);
      currentBopContext.results.set(dependency.key, results);
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
    input : Dependency, currentBop : BopContext, _inputs : object) : object {
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
