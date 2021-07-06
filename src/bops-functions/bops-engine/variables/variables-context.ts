import { MappedFunctions } from "@api/bops-functions/bops-engine/modules-manager";
import { JsonTypes } from "@api/common/types/json-types";
import { BopsVariable } from "@api/configuration/business-operations/business-operations-type";
import { ConfigurationType } from "@api/configuration/configuration-type";
import { decreaseVariableFunction } from "./functions/decrease-variable";
import { increaseVariableFunction } from "./functions/increase-variable";
import { setVariableFunction } from "./functions/set-variable";

type ResolvedVariable = { type : JsonTypes, value : unknown };
export type ResolvedVariables = Record<string, ResolvedVariable>;

export class VariableContext {
  public variables : ResolvedVariables;

  constructor (variables : BopsVariable[]) {
    this.variables = this.resolveBopVariables(variables);
  }

  public static validateSystemVariables (systemConfig : ConfigurationType) : Record<string, BopsVariable[]> {
    const systemVariables : Record<string, BopsVariable[]> = {};
    for(const bop of systemConfig.businessOperations) {
      systemVariables[bop.name] = this.validadeBopVariables(bop.variables);
    }
    return systemVariables;
  }

  private static validadeBopVariables (variables : BopsVariable[]) : BopsVariable[] {
    variables.forEach(variable => {
      if(variable.initialValue !== undefined) {
        if(variable.type !== typeof variable.initialValue) throw new Error("Invalid var type");
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

  private variableFunctions : Array<[string, Function]> = [
    ["=setVariable", setVariableFunction.bind(this)],
    ["=increaseVariable", increaseVariableFunction.bind(this)],
    ["=decreaseVariable", decreaseVariableFunction.bind(this)],
  ];
}
