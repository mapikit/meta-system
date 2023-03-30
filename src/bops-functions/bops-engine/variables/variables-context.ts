
import { isValidType } from "../../../common/assertions/is-valid-type.js";
import { ConfigurationType } from "../../../index.js";
import { ExtendedJsonTypes } from "../../../common/types/json-types.js";
import { BopsVariable } from "../../../configuration/business-operations/business-operations-type.js";
import { MappedFunctions, ModuleFullName } from "../modules-manager.js";
import { decreaseVariableFunctionInformation, decreaseVariablesFunction } from "./functions/decrease-variable.js";
import { increaseVariableFunctionInformation, increaseVariablesFunction } from "./functions/increase-variable.js";
import { setVariablesFunction, setVariablesFunctionInformation } from "./functions/set-variable.js";
import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

type ResolvedVariable = { type : ExtendedJsonTypes | "any", value : unknown };
export type ResolvedVariables = Record<string, ResolvedVariable>;

export class VariableContext {
  public variables : ResolvedVariables;

  constructor (variables : BopsVariable[]) {
    this.variables = this.resolveBopVariables(variables);
  }

  public static validateSystemVariables (systemConfig : ConfigurationType) : Record<string, BopsVariable[]> {
    const systemVariables : Record<string, BopsVariable[]> = {};
    for(const bop of systemConfig.businessOperations) {
      systemVariables[bop.name] = VariableContext.validateBopVariables(bop.variables);
    }
    return systemVariables;
  }

  private static validateBopVariables (variables : BopsVariable[]) : BopsVariable[] {
    variables.forEach(variable => {
      if(variable.initialValue !== undefined) {
        if(!isValidType(variable.initialValue, variable.type)) {
          throw new Error(`Var ${variable.name} expected to be a(n) ${variable.type} but initial value `
          + `${variable.initialValue} is of type ${typeof variable.initialValue}`);
        }
      }
    });
    return variables;
  }

  private resolveBopVariables (variables : BopsVariable[]) : ResolvedVariables {
    const vars : ResolvedVariables = {};
    variables.forEach(variable => {
      vars[variable.name] = { type: variable.type, value: variable.initialValue };
    });
    return vars;
  }

  public appendVariableFunctions (functionsMap : MappedFunctions) : MappedFunctions {
    return new Map([
      ...Array.from(functionsMap),
      ...this.getVariableFunctions(),
    ]);
  }

  private getVariableFunctions : () => Array<[ModuleFullName<"variable">, Function]> = () => [
    ["variable.increaseVariables", this.wrapVariables(increaseVariablesFunction)],
    ["variable.setVariables", this.wrapVariables(setVariablesFunction)],
    ["variable.decreaseVariables", this.wrapVariables(decreaseVariablesFunction)],
  ];

  private wrapVariables (varFunction : Function) : Function {
    const resultFunction = (inputs : unknown) : unknown => {
      const res = varFunction(inputs, this.variables);
      return res;
    };
    return resultFunction;
  }

  public static variablesInfo : Map<string, InternalMetaFunction> = new Map([
    ["setVariables", setVariablesFunctionInformation],
    ["increaseVariables", increaseVariableFunctionInformation],
    ["decreaseVaraibles", decreaseVariableFunctionInformation],
  ])
}
