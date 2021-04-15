/* eslint-disable max-lines-per-function */
import { MappedConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { ConstantNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/constant-not-found-error";
import { FlowError, FlowResult, MappedFunctions } from "@api/bops-functions/bops-engine/module-types";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import { BopsConfigurationEntry, InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { performance }  from "perf_hooks";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";

export class FlowResolver {
  private startingClock : number;
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
  }

  public async startFlow () : Promise<FlowResult | FlowError> {
    this.startingClock = performance.now();
    const firstModule = this.modulesConfig.find(module => module.key === 1);
    try { await this.executeModule(firstModule); }
    catch(error) {
      return {
        executionError: {
          errorName : error.name,
          errorMessage : error.message,
        },
      };
    };
    return { results: this.modulesResults };
  }

  public async executeModule (moduleConfig : BopsConfigurationEntry) : Promise<void> {
    const elapsedTime = performance.now() - this.startingClock;
    if(elapsedTime >= 2000) throw new TTLExceededError(Math.round(elapsedTime));
    let moduleInput = {};
    for (const input of moduleConfig.inputsSource) {
      const resolvedInput = await this.resulveInput(input);
      const resTarg = input.target.replace("[$source]", "");
      if(resolvedInput[resTarg] instanceof Array) {
        resolvedInput[resTarg] = moduleInput[resTarg] ?
          resolvedInput[resTarg].concat(moduleInput[resTarg]) :
          resolvedInput[resTarg];
      }
      Object.assign(moduleInput, resolvedInput);
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

  private async resulveInput (inputInfo : InputsSource) : Promise<object> { // Improve this now
    let valueToInput : unknown;
    if(typeof inputInfo.source === "string") {
      const constName = inputInfo.source.slice(1);
      valueToInput = this.mappedConstants.get(constName);
      if(!valueToInput) throw new ConstantNotFoundError(constName, inputInfo.target);
    }

    if(typeof inputInfo.source === "number") {
      if(!this.modulesResults.get(inputInfo.source)) {
        const sourceModuleConfig = this.modulesConfig.find(module => module.key === inputInfo.source);
        await this.executeModule(sourceModuleConfig);
      };
      const foundResult = this.modulesResults.get(inputInfo.source);
      valueToInput = this.extractOutput(foundResult, inputInfo.sourceOutput);
    }

    if(inputInfo.target.includes("[$source]")) {
      return { [inputInfo.target.replace("[$source]", "")]:[valueToInput] };
    }
    return { [inputInfo.target]: valueToInput };
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
    targetLevels.forEach(level => {
      if(!current[level]) throw new Error(`${level} was not found in ${source}`);
      current = current[level];
    });
    return current;
  }
}
