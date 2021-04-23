import { ResolvedConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { ConstantNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/constant-not-found-error";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { performance }  from "perf_hooks";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import { inspect } from "util";
import constants from "@api/mapikit/constants";
import { ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-resolver";
import { CloudedObject } from "@api/common/types/clouded-object";

export type MappedFunctions = Map<string, ModuleResolverOutput>;
type ResultsType = { [moduleKey : number ] : CloudedObject & FlowResult }
type FlowErrorType = {
  partialResults : ResultsType;
  errorName : string;
  errorMessage : string;
}

export interface FlowResult {
  results ?: ResultsType;
  executionError ?: FlowErrorType;
}

export class BopsEngine {
  private startingClock : number;
  private readonly maxExecutionTime : number
  private readonly constants : Record<string, ResolvedConstants | BusinessOperations>;
  private readonly mappedFunctions : MappedFunctions;

  constructor (options : {
    MappedFunctions : MappedFunctions;
    MappedConstants : Record<string, ResolvedConstants | BusinessOperations>;
    MaxExecutionTime ?: number;
  }) {
    this.constants = options.MappedConstants;
    this.mappedFunctions = options.MappedFunctions;
    this.maxExecutionTime = options.MaxExecutionTime ?? 2000;

    this.startFlow = this.startFlow.bind(this);

    this.mapBopsEngineFunctions();
  }

  private mapBopsEngineFunctions () : void {
    this.mappedFunctions.forEach((map, key) => {
      if(key.includes("+")) {
        const engineFunction = async (inputs : object, results : object) : Promise<FlowResult> => {
          return this.startFlow({ bopConfig: this.constants[key] as BusinessOperations, ...inputs }, results);
        };
        map.main = engineFunction;
      }
    });
  }

  public async startFlow (input : { bopConfig : BusinessOperations }, results = {}) : Promise<FlowResult> {
    this.startingClock = performance.now();
    const firstModule = input.bopConfig.configuration.find(module => module.key === 1);
    return this.executeModule(firstModule, results, input.bopConfig)
      .then(() => { return { results: results }; })
      .catch(err => {
        return { executionError: {
          errorName: err.name,
          errorMessage: err.message,
          partialResults: results,
        } }; });
  }

  public async executeModule (
    moduleConfig : BopsConfigurationEntry,
    results : object,
    bopConfig : BusinessOperations) : Promise<void> {
    const elapsedTime = performance.now() - this.startingClock;
    if(elapsedTime >= this.maxExecutionTime) throw new TTLExceededError(Math.round(elapsedTime));

    const moduleInput = await this.resolveInputs(moduleConfig.inputsSource, results, bopConfig);
    const result = await this.mappedFunctions.get(moduleConfig.moduleRepo).main(moduleInput);
    results[moduleConfig.key] = result;

    const branchToFollow = pickBranchOutput(this.mappedFunctions.get(moduleConfig.moduleRepo).outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = bopConfig.configuration.find(module => module.key === nextKey);
    await this.executeModule(nextModule, results, bopConfig);
  }

  private async resolveInputs (
    inputs : InputsSource[],
    results : object,
    bopConfig : BusinessOperations) : Promise<unknown> {
    for (const input of inputs) {
      const resolved = await this.resulveInput(input, results, bopConfig);
      const objectKey = Object.keys(resolved)[0];
      if(resolved[objectKey] instanceof Array) {
        resolved[objectKey] = [...(inputs[objectKey] ?? []), ...resolved[objectKey]];
      }
      Object.assign(inputs, resolved);
    }
    return this.resolveTargets(inputs);
  }

  // eslint-disable-next-line max-lines-per-function
  private async resulveInput (
    inputInfo : InputsSource,
    results : object,
    bopConfig : BusinessOperations) : Promise<Record<string, unknown>|Record<string, unknown>[]> {
    let valueToInput : unknown;
    switch (typeof inputInfo.source) {
      case "string":
        const constName = inputInfo.source.slice(1);
        valueToInput = this.constants[bopConfig.name][constName];
        if(!valueToInput) throw new ConstantNotFoundError(constName, inputInfo.target);
        break;

      case "number":
        if(!results[inputInfo.source]) {
          const sourceModuleConfig = bopConfig.configuration.find(module => module.key === inputInfo.source);
          await this.executeModule(sourceModuleConfig, results, bopConfig);
        };
        valueToInput = this.extractOutput(results[inputInfo.source], inputInfo.sourceOutput);
        break;
    }

    const targetIsArray = inputInfo.target.includes(constants.ARRAY_INDICATOR);
    return { [inputInfo.target.replace(constants.ARRAY_INDICATOR, "")]: targetIsArray ? [valueToInput] : valueToInput };
  }

  private resolveTargets (source : unknown) : unknown {
    const res = {};
    for(const key of Object.keys(source)) {
      const targetLevels = key.split(".");
      let current = res;
      targetLevels.forEach((level, index) => {
        current[level] = (index == targetLevels.length-1) ? source[key] : current[level] || {};
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
      if(!current[level]) throw new Error(`${level} was not found in ${inspect(source, false, null)}`);
      current = current[level];
    });
    return current;
  }
}
