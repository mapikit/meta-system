import constants from "../../common/constants.js";
import { BusinessOperations, Dependency }
  from "../../configuration/business-operations/business-operations-type.js";
import { ConfigurationType } from "../../configuration/configuration-type.js";
import { addTimeout } from "./add-timeout.js";
import { ModuleManager } from "./modules-manager.js";
import { ObjectResolver } from "./object-manipulator.js";
import { VariableContext } from "./variables/variables-context.js";
import { BopSystemContext } from "./contexts/bop-system-context.js";
import { BopContext } from "./contexts/bop-context.js";
import { getObjectProperty } from "../../common/helpers/get-object-property.js";
import { logger } from "../../common/logger/logger.js";

/**
 * This is the engine responsible for stitching all the functions in all the BOps in the system
 */
export class BopsEngine {
  private readonly systemContext : BopSystemContext;

  constructor (options : {
    ModuleManager : ModuleManager;
    SystemConfig : ConfigurationType;
  }) {
    this.systemContext = new BopSystemContext(options);
  }

  // eslint-disable-next-line max-lines-per-function
  public stitch (operation : BusinessOperations, msTimeout : number = constants.ENGINE_TTL) : Function {
    this.systemContext.generateMappedFunctions();
    const output = operation.configuration.find(module => module.moduleType === "output");

    logger.debug(`[BOP] Stitching BOP ${operation.name} with ${operation.configuration.length} modules`);

    // eslint-disable-next-line max-lines-per-function
    const stitched = async (_inputs : Record<string, unknown>) : Promise<unknown> => {
      const variablesInfo = new VariableContext(this.systemContext.variables[operation.name]);
      const bopContext = new BopContext(
        operation.configuration,
        variablesInfo.variables,
        this.systemContext.constants[operation.name],
        variablesInfo.appendVariableFunctions(this.systemContext.mappedFunctions),
      );
      logger.debug(`>>>> Start of BOp ${operation.name} >>>>`);
      logger.debug("BOp Inputs:", _inputs);
      const res = await this.getInputs(output.dependencies, bopContext, _inputs);
      logger.debug(`[${operation.name}] End of Execution. Stored Results:\n`, bopContext.resultsCache);
      logger.debug("BOp Output:", res);
      logger.debug(`<<<< End of BOp ${operation.name} <<<<\n\n`);

      return res;
    };
    return addTimeout(msTimeout, stitched);
  }

  /** Executes required modules to get the value of inputs */
  private async getInputs (inputs : Dependency[], currentBop : BopContext, _inputs : object) : Promise<object> {
    const resolved = new Array<object>();
    for(const input of inputs) {
      if(typeof input.origin === "string") resolved.push(this.solveStaticInput(input, currentBop, _inputs));
      if(typeof input.origin === "number") resolved.push(await this.solveModularInput(input, currentBop, _inputs));
    }

    return ObjectResolver.flattenObject(resolved);
  }

  // eslint-disable-next-line max-lines-per-function
  private async solveModularInput (
    input : Dependency,
    currentBopContext : BopContext,
    _inputs : object) : Promise<object> {
    const dependency = currentBopContext.config.find(module => module.key === input.origin);
    const dependencyName = ModuleManager.getFullModuleName(dependency);
    const moduleFunction = currentBopContext.availableFunctions.get(dependencyName);
    if(input.originPath === undefined) {
      const resolvedInputs = await this.getInputs(dependency.dependencies, currentBopContext, _inputs);
      logger.debug(`[Functional Dependency] Executing ${dependency.moduleName} @${dependency.key} with input:
      >>`, resolvedInputs);
      const result = await moduleFunction(resolvedInputs);
      currentBopContext.resultsCache.set(dependency.key, result);
      return;
    }

    const [origin, ...paths] = input.originPath.split(".");

    if(origin === "result") {
      const resolvedInputs = await this.getInputs(dependency.dependencies, currentBopContext, _inputs);
      logger.debug(`[Results Required] Executing ${dependency.moduleName} @${dependency.key} with input:
      >>`, resolvedInputs);
      const results = currentBopContext.resultsCache.get(dependency.key) ?? await moduleFunction(resolvedInputs);
      logger.debug(`Got the following result:
      >>`,results);
      currentBopContext.resultsCache.set(dependency.key, results);
      return { [input.targetPath]: ObjectResolver.extractProperty(results, paths) };
    }

    if(origin === "module") {
      const paramsGetter = async () : Promise<unknown> => {
        const context = BopContext.cloneToNewContext(currentBopContext);
        return this.getInputs(dependency.dependencies, context, _inputs);
      };
      const wrappedFunction = this.wrapFunction(moduleFunction, paramsGetter, paths, dependencyName);
      return { [input.targetPath]: wrappedFunction };
    }

    throw new Error("Incorrect originPath configuration");
  }

  // eslint-disable-next-line max-lines-per-function
  private solveStaticInput (
    input : Dependency, currentBop : BopContext, _inputs : object) : object {
    switch (input.origin) {
      case "constant":
      case "constants":
        const foundConstant = currentBop.constants[input.originPath];
        return { [input.targetPath]: foundConstant };
      case "input":
      case "inputs":
        return { [input.targetPath]: getObjectProperty(_inputs, input.originPath) };
      case "variable":
      case "variables":
        return { [input.targetPath]: currentBop.variables[input.originPath].value };
      case "env":
      case "envs":
      case "environment":
        return { [input.targetPath]: this.systemContext.envs[input.originPath] };
    }
  }

  // eslint-disable-next-line max-params
  private wrapFunction (
    fn : Function, paramsGetter : () => Promise<unknown>, path : string[], functionName : string,
  ) : () => Promise<unknown> {
    return async function () : Promise<unknown> {
      const params = await paramsGetter();
      logger.debug(`\t[Wrapped Function] Running wrapped function "${functionName}" with inputs`, params);
      const result = ObjectResolver.extractProperty(await fn(params), path);
      return result;
    };
  };
};
