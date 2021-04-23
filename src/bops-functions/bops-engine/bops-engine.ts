import { ResolvedConstants } from "@api/bops-functions/bops-engine/constant-validation";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  InputsSource } from "@api/configuration-de-serializer/domain/business-operations-type";
import { performance }  from "perf_hooks";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import constants from "@api/mapikit/constants";
import { CloudedObject } from "@api/common/types/clouded-object";
import { ObjectResolver } from "@api/bops-functions/bops-engine/object-manipulator";
import { MappedFunctions } from "@api/bops-functions/bops-engine/modules-manager";

type ResultsType = { [moduleKey : number ] : CloudedObject & FlowResult }
type FlowErrorType = {
  partialResults : ResultsType;
  errorName : string;
  errorMessage : string;
}

interface FlowInfo { bopConfig : BusinessOperations; inputs ?: CloudedObject }

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
        const engineFunction = async (inputs : object, results : ResultsType) : Promise<FlowResult> => {
          return this.startFlow({ bopConfig: this.constants[key] as BusinessOperations, ...inputs }, results);
        };
        map.main = engineFunction;
      }
    });
  }

  /**
   * Starts the execution flow for the given BOp. Flow starts at key 1, but ending depends
   * on the results and configured branching.
   *
   * @returns An object with all the flow results. Object keys match modules keys and object values
   * correspond to the results. ( [moduleKey] : [moduleResult] )
   */
  public async startFlow (input : FlowInfo, results = {}) : Promise<FlowResult> {
    this.startingClock = performance.now();
    const firstModule = input.bopConfig.configuration.find(module => module.key === 1);
    const inputs = ObjectResolver.validateConfiguredInputs(input.bopConfig.inputs, input.inputs);
    return this.executeModule(firstModule, { bopConfig: input.bopConfig, inputs }, results)
      .then(() => { return { results: results }; })
      .catch(err => { return { executionError: {
        errorName: err.name,
        errorMessage: err.message,
        partialResults: results,
      } }; });
  }

  /**
   * Executes the given module grabing required inputs from constants or other modules.
   * When done proceeds to nextFunction if present
   */
  public async executeModule (
    moduleConfig : BopsConfigurationEntry,
    flowInfo : FlowInfo,
    results : ResultsType) : Promise<void> {

    const elapsedTime = performance.now() - this.startingClock;
    if(elapsedTime >= this.maxExecutionTime) throw new TTLExceededError(Math.round(elapsedTime));

    const moduleInput = await this.resolveInputs(moduleConfig.inputsSource, flowInfo, results);
    const result = await this.mappedFunctions.get(moduleConfig.moduleRepo).main(moduleInput);
    results[moduleConfig.key] = result;

    const branchToFollow = pickBranchOutput(this.mappedFunctions.get(moduleConfig.moduleRepo).outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = flowInfo.bopConfig.configuration.find(module => module.key === nextKey);
    await this.executeModule(nextModule, flowInfo, results);
  }

  /**
   * Resolves all module inputs, returning the apropiate object to be used as a module input
   */
  private async resolveInputs (inputs : InputsSource[], flowInfo : FlowInfo, results : ResultsType) : Promise<unknown> {
    for (const input of inputs) {
      const resolved = await this.resulveInput(input, flowInfo, results);
      const objectKey = Object.keys(resolved)[0];
      if(resolved[objectKey] instanceof Array) {
        resolved[objectKey] = [...(inputs[objectKey] ?? []), ...resolved[objectKey]];
      }
      Object.assign(inputs, resolved);
    }
    return ObjectResolver.resolveTargets(inputs);
  }

  /**
   * Resolves the given input, as an object property or an array as cofigured
   */
  private async resulveInput (input : InputsSource, flowInfo : FlowInfo, results : ResultsType) : Promise<unknown> {

    const inputValue = await this.getInputValue(input, flowInfo, results);
    const targetIsArray : boolean = input.target.includes(constants.ARRAY_INDICATOR);
    return { [input.target.replace(constants.ARRAY_INDICATOR, "")]: targetIsArray ? [inputValue] : inputValue };
  }

  /**
   * Returns the value of the given input. If required, will execute the funcion from which the value
   * will be extracted
   */
  private async getInputValue (input : InputsSource, flowInfo : FlowInfo, results : ResultsType) : Promise<unknown> {
    switch (typeof input.source) {
      case "string":
        const constName = input.source.slice(1);
        return this.constants[flowInfo.bopConfig.name][constName] || flowInfo.inputs[constName];

      case "number":
        if(!results[input.source]) {
          const sourceModuleConfig = flowInfo.bopConfig.configuration.find(module => module.key === input.source);
          await this.executeModule(sourceModuleConfig, flowInfo, results);
        };
        return ObjectResolver.extractOutput(results[input.source], input.sourceOutput);
    }
  }
}
