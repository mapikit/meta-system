
import { isValidType } from "../../../common/assertions/is-valid-type";
import { ConfigurationType } from "../../..";
import { ExtendedJsonTypes } from "../../../common/types/json-types";
import { BopsVariable } from "../../../configuration/business-operations/business-operations-type";
import { MappedFunctions, ModuleFullName } from "../modules-manager";
import { decreaseVariablesFunction } from "./functions/decrease-variable";
import { increaseVariablesFunction } from "./functions/increase-variable";
import { setVariablesFunction } from "./functions/set-variable";

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
      systemVariables[bop.name] = this.validateBopVariables(bop.variables);
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
      ...this.variableFunctions,
    ]);
  }

  private variableFunctions : Array<[ModuleFullName<"variable">, Function]> = [
    ["variable.setVariables", this.wrapVariables(setVariablesFunction)],
    ["variable.increaseVariables", this.wrapVariables(increaseVariablesFunction)],
    ["variable.decreaseVariables", this.wrapVariables(decreaseVariablesFunction)],
  ];

  private wrapVariables (varFunction : Function) : Function {
    return (inputs : unknown) : unknown => varFunction(inputs, this.variables);
  }
}
