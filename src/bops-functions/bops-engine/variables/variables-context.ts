
import { isValidType } from "../../../common/assertions/is-valid-type";
import { ConfigurationType } from "../../..";
import { ExtendedJsonTypes } from "../../../common/types/json-types";
import { BopsVariable } from "../../../configuration/business-operations/business-operations-type";
import { MappedFunctions, ModuleFullName } from "../modules-manager";
import { decreaseVariableFunctionInformation, decreaseVariablesFunction } from "./functions/decrease-variable";
import { increaseVariableFunctionInformation, increaseVariablesFunction } from "./functions/increase-variable";
import { setVariablesFunction, setVariablesFunctionInformation } from "./functions/set-variable";
import { InternalMetaFunction } from "bops-functions/internal-meta-function";

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
    console.log("wraping", varFunction.name, "with", Object.keys(this.variables));
    const resultFunction = (inputs : unknown) : unknown => {
      console.log("Running var fun", varFunction.name, this.variables);
      const res = varFunction(inputs, this.variables);
      console.log(res);
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
