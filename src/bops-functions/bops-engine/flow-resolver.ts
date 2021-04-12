/* eslint-disable max-lines-per-function */
import { MappedConstants, validateConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { MappedFunction } from "@api/bops-functions/bops-engine/module-resolve";
import { ModuleManager } from "@api/bops-functions/bops-engine/module-resolve";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { inspect } from "util";

export class FlowResolver {
  private mappedConstants : MappedConstants;
  private mappedFunctions : MappedFunction;
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
    this.mappedFunctions = await this.moduleManager.resolveModules(bopConfig.configuration);
    this.modules = {
      config: bopConfig.configuration,
      results:  new Map<number, unknown>(),
    };
  }

  public async startFlow () : Promise<void> {
    const firstModule = this.modules.config.find(module => module.key === 1);
    await this.executeModule(firstModule);
    console.log(inspect(this.modules.results, false, null, true));
  }

  public async executeModule (moduleConfig : BopsConfigurationEntry) : Promise<void> {
    const moduleInput = {};
    for (const input of moduleConfig.inputsSource) {
      console.log(`Resolving input ${input.source}`);
      Object.assign(moduleInput, await this.resulveInput(input));
    }
    console.log("Unresolved input:");
    console.log(moduleInput);
    this.resolveTarget(moduleInput);

    console.log(`Executing module "${moduleConfig.moduleRepo}" with input:`);
    console.log(moduleInput);
    const result = await this.mappedFunctions.get(moduleConfig.moduleRepo)(moduleInput);
    this.modules.results.set(moduleConfig.key, result);

    const branchToFollow = pickBranchOutput(this.moduleManager.mappedOutputs.get(moduleConfig.moduleRepo), result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return; //EOL
    const nextModule = this.modules.config.find(module => module.key === nextKey);
    await this.executeModule(nextModule);
  }

  private async resulveInput (inputInfo : InputsSource) : Promise<object> {
    if(typeof inputInfo.source === "string") {
      const constName = inputInfo.source.slice(1);
      const constValue = this.mappedConstants.get(constName);
      if(constValue) return { [inputInfo.target]: constValue };
      throw new Error("Constant was not found");
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

  private resolveTarget (obj : object) : void { //TODO IMPROVE THIS
    for(const key of Object.keys(obj)) {
      const targetLevels = key.split(".");
      let current = obj;
      if(targetLevels.length > 1) {
        targetLevels.forEach((level, index) => {
          current[level] = (index == lastIndexOf(targetLevels)) ? obj[key] : current[level] || {};
          current = current[level];
        });
        delete obj[key];
      }
    }
  }

  private extractOutput (source : unknown, desiredOutput ?: string) : unknown {
    if(!desiredOutput) return source;
    const targetLevels = desiredOutput.split(".");
    let current = source;
    targetLevels.forEach(level => {
      current = current[level];
    });
    return current;
  }
}

const lastIndexOf = (array : Array<unknown>) : number => array.length-1;
