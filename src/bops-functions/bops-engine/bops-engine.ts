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
import { bopsEngineInfo } from "@api/bops-functions/bops-engine/meta-function";
import constants from "@api/mapikit/constants";
import { ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-resolver";

export type MappedFunctions = Map<string, ModuleResolverOutput>;

export interface FlowResult {
  results ?: { [moduleKey : number] : unknown };
  executionError ?: {
    errorName : string;
    errorMessage : string;
  };
}

export class BopsEngine {
  private startingClock : number;
  private readonly maxExecutionTime : number
  private readonly constants : Record<string, ResolvedConstants>;
  private readonly mappedFunctions : MappedFunctions;
  private bopConfig : BusinessOperations;
  private results : { [moduleKey : number] : unknown };

  constructor (options : {
    MappedFunctions : MappedFunctions;
    MappedConstants : Record<string, ResolvedConstants>;
    MaxExecutionTime ?: number;
  }) {
    this.constants = options.MappedConstants;
    this.mappedFunctions = options.MappedFunctions;
    this.maxExecutionTime = options.MaxExecutionTime ?? 2000;

    this.mappedFunctions.set("*bops-engine", { main: this.startFlow, outputData: bopsEngineInfo.outputData });
  }

  public async startFlow (input : { bopConfig : BusinessOperations }) : Promise<FlowResult> {
    this.results = {};
    this.bopConfig = input.bopConfig;
    this.startingClock = performance.now();
    const firstModule = this.bopConfig.configuration.find(module => module.key === 1);
    return this.executeModule(firstModule)
      .then(() => { return { results: this.results }; })
      .catch(err => { return { executionError: { errorName: err.name, errorMessage: err.message } }; });
  }

  public async executeModule (moduleConfig : BopsConfigurationEntry) : Promise<void> {
    const elapsedTime = performance.now() - this.startingClock;
    if(elapsedTime >= this.maxExecutionTime) throw new TTLExceededError(Math.round(elapsedTime));

    const moduleInput = await this.resolveInputs(moduleConfig.inputsSource);
    const result = await this.mappedFunctions.get(moduleConfig.moduleRepo).main(moduleInput);
    this.results[moduleConfig.key] = result;

    const branchToFollow = pickBranchOutput(this.mappedFunctions.get(moduleConfig.moduleRepo).outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = this.bopConfig.configuration.find(module => module.key === nextKey);
    await this.executeModule(nextModule);
  }

  private async resolveInputs (inputs : InputsSource[]) : Promise<unknown> {
    for (const input of inputs) {
      const resolved = await this.resulveInput(input);
      const objectKey = Object.keys(resolved)[0];
      if(resolved[objectKey] instanceof Array) {
        resolved[objectKey] = [...(inputs[objectKey] ?? []), ...resolved[objectKey]];
      }
      Object.assign(inputs, resolved);
    }
    return this.resolveTargets(inputs);
  }

  // eslint-disable-next-line max-lines-per-function
  private async resulveInput (inputInfo : InputsSource) : Promise<Record<string, unknown>|Record<string, unknown>[]> {
    let valueToInput : unknown;
    switch (typeof inputInfo.source) {
      case "string":
        const constName = inputInfo.source.slice(1);
        valueToInput = this.constants[this.bopConfig.name][constName];
        if(!valueToInput) throw new ConstantNotFoundError(constName, inputInfo.target);
        break;

      case "number":
        if(!this.results[inputInfo.source]) {
          const sourceModuleConfig = this.bopConfig.configuration.find(module => module.key === inputInfo.source);
          await this.executeModule(sourceModuleConfig);
        };
        valueToInput = this.extractOutput(this.results[inputInfo.source], inputInfo.sourceOutput);
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
