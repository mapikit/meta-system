/* eslint-disable max-lines-per-function */
import { MappedConstants, validateConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { ConstantNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/constant-not-found-error";
import { ModuleManager } from "@api/bops-functions/bops-engine/module-resolve";
import { MappedModules } from "@api/bops-functions/bops-engine/module-types";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { inspect } from "util";

export class FlowResolver {
  private mappedConstants : MappedConstants;
  private mappedModules : MappedModules;
  private moduleManager : ModuleManager;
  private modules : {
    results : Map<number, unknown>;
    config : BopsConfigurationEntry[];
  };

  public async initialize (bopConfig : BusinessOperations, schemasManager : SchemasManager) : Promise<void> {
    this.mappedConstants = validateConstants(bopConfig.constants);
    this.moduleManager = new ModuleManager({
      SchemaManager: schemasManager,
      FunctionsFolder: "bops-functions",
      BOpsConfigFile: "meta-function.json",
    });
    this.mappedModules = await this.moduleManager.resolveModules(bopConfig.configuration);
    this.modules = {
      config: bopConfig.configuration,
      results:  new Map<number, unknown>(),
    };
  }

  public async startFlow () : Promise<Map<number, unknown>> {
    const firstModule = this.modules.config.find(module => module.key === 1);
    await this.executeModule(firstModule);
    console.log(inspect(this.modules.results, false, null, true));
    return this.modules.results;
  }

  public async executeModule (moduleConfig : BopsConfigurationEntry) : Promise<void> {
    let moduleInput = {};
    for (const input of moduleConfig.inputsSource) {
      Object.assign(moduleInput, await this.resulveInput(input));
    }
    moduleInput = this.resolveTargets(moduleInput);
    const result = await this.mappedModules.get(moduleConfig.moduleRepo).mainFunction(moduleInput);
    this.modules.results.set(moduleConfig.key, result);

    const branchToFollow = pickBranchOutput(this.mappedModules.get(moduleConfig.moduleRepo).outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = this.modules.config.find(module => module.key === nextKey);
    await this.executeModule(nextModule);
  }

  private async resulveInput (inputInfo : InputsSource) : Promise<object> {
    if(typeof inputInfo.source === "string") {
      const constName = inputInfo.source.slice(1);
      const constValue = this.mappedConstants.get(constName);
      if(constValue) return { [inputInfo.target]: constValue };
      throw new ConstantNotFoundError(constName, inputInfo.target);
    }

    if(typeof inputInfo.source === "number") {
      let foundResult = this.modules.results.get(inputInfo.source);
      if(!foundResult) {
        const sourceModuleConfig = this.modules.config.find(module => module.key === inputInfo.source);
        foundResult = await this.executeModule(sourceModuleConfig);
      };

      return { [inputInfo.target] : this.extractOutput(foundResult, inputInfo.sourceOutput) };
    }
  }

  private resolveTargets (obj : object) : object {
    const res = {};
    for(const key of Object.keys(obj)) {
      const targetLevels = key.split(".");
      let current = res;
      targetLevels.forEach((level, index) => {
        current[level] = (index == targetLevels.length-1) ? obj[key] : current[level] || {};
        current = current[level];
      });
    }
    return res;
  }

  private extractOutput (source : unknown, desiredOutput ?: string) : unknown {
    if(!desiredOutput) return source;
    const targetLevels = desiredOutput.split(".");
    let current = source;
    targetLevels.forEach(level => { current = current[level]; });
    return current;
  }
}
