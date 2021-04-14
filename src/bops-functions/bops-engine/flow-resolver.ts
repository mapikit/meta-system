/* eslint-disable max-lines-per-function */
import { MappedConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { ConstantNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/constant-not-found-error";
import { MappedFunctions } from "@api/bops-functions/bops-engine/module-types";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import { BopsConfigurationEntry, InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { inspect } from "util";
import { performance }  from "perf_hooks";
import timer from "@api/bops-functions/bops-engine/performance-observer";

export class FlowResolver {
  private readonly mappedConstants : MappedConstants;
  private readonly mappedFunctions : MappedFunctions;
  private readonly modulesConfig : BopsConfigurationEntry[];
  private modulesResults = new Map<number, unknown>();


  constructor (options : {
    mappedFunctions : MappedFunctions;
    mappedConstants : MappedConstants;
    bopConfig : BopsConfigurationEntry[];
  }) {
    this.mappedFunctions = options.mappedFunctions;
    this.mappedConstants = options.mappedConstants;
    this.modulesConfig = options.bopConfig;

    this.executeModule = performance.timerify(this.executeModule);
  }

  public async startFlow () : Promise<Map<number, unknown>> {
    timer.startClock();
    const firstModule = this.modulesConfig.find(module => module.key === 1);
    await this.executeModule(firstModule);
    console.log(inspect(this.modulesResults, false, null, true));
    return this.modulesResults;
  }

  public async executeModule (moduleConfig : BopsConfigurationEntry) : Promise<void> {
    let moduleInput = {};
    for (const input of moduleConfig.inputsSource) {
      Object.assign(moduleInput, await this.resulveInput(input));
    }
    moduleInput = this.resolveTargets(moduleInput);
    const result = await this.mappedFunctions.get(moduleConfig.moduleRepo).main(moduleInput);
    this.modulesResults.set(moduleConfig.key, result);

    const branchToFollow = pickBranchOutput(this.mappedFunctions.get(moduleConfig.moduleRepo).outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = this.modulesConfig.find(module => module.key === nextKey);
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
      let foundResult = this.modulesResults.get(inputInfo.source);
      if(!foundResult) {
        const sourceModuleConfig = this.modulesConfig.find(module => module.key === inputInfo.source);
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
