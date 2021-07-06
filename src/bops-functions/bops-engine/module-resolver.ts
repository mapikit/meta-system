import { BopsConfigurationEntry } from "src/configuration/business-operations/business-operations-type";
import { SchemasManager } from "src/schemas/application/schemas-manager";
import { SchemasFunctions } from "src/schemas/domain/schemas-functions";
import { FunctionManager } from "../function-managers/function-manager";
import { ProvidedFunctionNotFound } from "./engine-errors/function-not-found";
import { OperationNotFoundError } from "./engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "./engine-errors/schema-not-found-error";

export interface ModuleResolverInputs {
  ExternalFunctionManager : FunctionManager;
  InternalFunctionManager : FunctionManager;
  SchemasManager : SchemasManager;
  BopsManager : FunctionManager;
}

enum RepoStartingCharacter {
  schemaFunctions = "@",
  internalFunctions = "#",
  externalFunctions = ":",
  bops = "+"
}
// Internal Bops (stating with '+') and Bop Output (starting with '%') are resolved separately

export type ModuleResolverType = {
  [char in RepoStartingCharacter] : (module : BopsConfigurationEntry) => Function;
}

export class ModuleResolver {
  private externalFunctionManager : FunctionManager;
  private internalFunctionManager : FunctionManager;
  private schemasManager : SchemasManager;
  private bopsManager : FunctionManager;

  constructor (options : ModuleResolverInputs)  {
    this.externalFunctionManager = options.ExternalFunctionManager;
    this.internalFunctionManager = options.InternalFunctionManager;
    this.schemasManager = options.SchemasManager;
    this.bopsManager = options.BopsManager;
  }

  public resolve : ModuleResolverType = {
    "+": (module) : Function => {
      const result = this.bopsManager.get(module.moduleRepo.slice(1));

      return result;
    },
    "@": (module) : Function => {
      const moduleName = module.moduleRepo.slice(1);
      const [schema, operation] = moduleName.split("@");
      if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

      const schemaToLook = this.schemasManager.schemas.get(schema);
      if(!schemaToLook) throw new SchemaNotFoundError(schema);

      return schemaToLook.bopsFunctions[operation];
    },

    "#" : (module) : Function => {
      const functionName = module.moduleRepo.slice(1);
      const foundFunction = this.internalFunctionManager.get(functionName);
      if(!foundFunction) throw new ProvidedFunctionNotFound(module.moduleRepo);
      return foundFunction;
    },

    ":" : (module) : Function => {
      return this.externalFunctionManager.get(module.moduleRepo.slice(1));
    },
  }
}
