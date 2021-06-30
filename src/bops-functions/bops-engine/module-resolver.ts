import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { ProvidedFunctionNotFound } from "@api/bops-functions/bops-engine/engine-errors/function-not-found";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { BopsConfigurationEntry } from "@api/configuration/business-operations/business-operations-type";
import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";

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
  [char in RepoStartingCharacter] : (module : BopsConfigurationEntry) => Promise<Function>;
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
    "+": async (module) : Promise<Function> => {
      return this.bopsManager.get(module.moduleRepo.slice(1));
    },
    "@": async (module) : Promise<Function> => {
      const moduleName = module.moduleRepo.slice(1);
      const [schema, operation] = moduleName.split("@");
      if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

      const schemaToLook = this.schemasManager.schemas.get(schema);
      if(!schemaToLook) throw new SchemaNotFoundError(schema);

      return schemaToLook.bopsFunctions[operation];
    },

    "#" : async (module) : Promise<Function> => {
      const functionName = module.moduleRepo.slice(1);
      const foundFunction = this.internalFunctionManager.get(functionName);
      if(!foundFunction) throw new ProvidedFunctionNotFound(module.moduleRepo);
      return foundFunction;
    },

    ":" : async (module) : Promise<Function> => {
      return this.externalFunctionManager.get(module.moduleRepo.slice(1));
    },
  }
}
