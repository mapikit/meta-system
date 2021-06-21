import { ResolvedConstants } from "@api/bops-functions/bops-engine/static-info-validation";
import { pickBranchOutput } from "@api/bops-functions/branch-control/define-output-branch";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  InputsSource } from "@api/configuration/domain/business-operations-type";
import { performance }  from "perf_hooks";
import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import constants from "@api/common/constants";
import { CloudedObject } from "@api/common/types/clouded-object";
import { ObjectResolver } from "@api/bops-functions/bops-engine/object-manipulator";
import { MappedFunctions } from "@api/bops-functions/bops-engine/modules-manager";
import { ResultNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/result-not-found";

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

type SourceValueGetter = {
  [typeAsString in "string" | "number"] :
  (input : InputsSource, flowInfo : FlowInfo, results : ResultsType) => Promise<unknown>;
}

export class BopsEngine {
  private startingTimestamp : number;
  private readonly maxExecutionTime : number
  private readonly staticInfo : Record<string, ResolvedConstants | BusinessOperations>;
  private readonly mappedFunctions : MappedFunctions;

  constructor (options : {
    MappedFunctions : MappedFunctions;
    StaticInfo : Record<string, ResolvedConstants | BusinessOperations>;
    MaxExecutionTime ?: number;
  }) {
    this.staticInfo = options.StaticInfo;
    this.mappedFunctions = options.MappedFunctions;
    this.maxExecutionTime = options.MaxExecutionTime ?? constants.ENGINE_TTL;

    this.startFlow = this.startFlow.bind(this);

    this.mapBopsEngineFunctions();
  }

  private mapBopsEngineFunctions () : void {
    this.mappedFunctions.forEach((map, key) => {
      if(key.includes("+")) {
        const engineFunction = async (inputs : object, results : ResultsType) : Promise<FlowResult> => {
          return this.startFlow({ bopConfig: this.staticInfo[key] as BusinessOperations, ...inputs }, results);
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
    this.startingTimestamp = performance.now();
    const firstModule = input.bopConfig.configuration.find(module => module.key === 1);
    const inputs = ObjectResolver.validateConfiguredInputs(input.bopConfig.inputs, input.inputs);
    return this.executeFunctionPipeline(firstModule, { bopConfig: input.bopConfig, inputs }, results)
      .then(() => { return { results: results }; })
      .catch(err => { return { executionError: {
        errorName: err.name,
        errorMessage: err.message,
        partialResults: results,
      } }; });
  }

  /**
   * Executes the given module grabbing required inputs from constants or other modules.
   * When done proceeds to nextFunction if present
   */
  // eslint-disable-next-line max-lines-per-function
  public async executeFunctionPipeline (
    moduleConfig : BopsConfigurationEntry,
    flowInfo : FlowInfo,
    results : ResultsType) : Promise<void> {

    const elapsedTime = performance.now() - this.startingTimestamp;
    if(elapsedTime >= this.maxExecutionTime) throw new TTLExceededError(Math.round(elapsedTime));

    const moduleInput = await this.resolveSources(moduleConfig.inputsSource, flowInfo, results);
    const moduleFunction = this.mappedFunctions.get(moduleConfig.moduleRepo);
    const result = await moduleFunction.main(moduleInput);
    results[moduleConfig.key] = result;

    const branchToFollow = pickBranchOutput(moduleFunction.outputData, result);
    const nextKey = moduleConfig.nextFunctions.find(func => func.branch === branchToFollow)?.nextKey;
    if(!nextKey) return;
    const nextModule = flowInfo.bopConfig.configuration.find(module => module.key === nextKey);
    await this.executeFunctionPipeline(nextModule, flowInfo, results);
  }

  /**
   * Resolves all module inputs, returning the apropiate object to be used as a module input
   */
  private async resolveSources (inputs : InputsSource[], flowInfo : FlowInfo, results : ResultsType)
    : Promise<unknown> {
    for (const input of inputs) {
      const resolvedInput = await this.resolveInput(input, flowInfo, results);
      const objectKey = Object.keys(resolvedInput)[0];
      if(resolvedInput[objectKey] instanceof Array) {
        const alreadyStoredInInputs = inputs[objectKey] ?? [];
        resolvedInput[objectKey] = [...alreadyStoredInInputs, ...resolvedInput[objectKey]];
      }
      Object.assign(inputs, resolvedInput);
    }
    return ObjectResolver.flattenObject(inputs);
  }

  /**
   * Resolves the given input, as an object property or an array as cofigured
   */
  private async resolveInput (input : InputsSource, flowInfo : FlowInfo, results : ResultsType) : Promise<unknown> {

    const sourceType = typeof input.source;
    const inputValue = await this.getSourceValue[sourceType](input, flowInfo, results);

    const targetIsArray : boolean = input.target.includes(constants.ARRAY_INDICATOR);
    return { [input.target.replace(constants.ARRAY_INDICATOR, "")]: targetIsArray ? [inputValue] : inputValue };
  }

  /**
   * Returns the value of the given input. If required, will execute the function from which the value
   * will be extracted
   */
  private  getSourceValue : SourceValueGetter  = {
    "string": (input, flowInfo) => {
      const constName = (input.source as string).slice(1);
      const constantValueFound = this.staticInfo[flowInfo.bopConfig.name][constName];
      const foundInputValue =  constantValueFound || flowInfo.inputs[constName];

      return foundInputValue;
    },

    "number": async (input, flowInfo, results) => {
      const requiredModuleResult = results[input.source];
      if(requiredModuleResult === undefined) throw new ResultNotFoundError(input.source as number, input.target);

      return ObjectResolver.extractProperty(results[input.source], input.sourceOutput);
    },
  }
}
