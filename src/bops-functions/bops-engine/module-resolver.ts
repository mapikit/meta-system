import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import PrebuiltFunctions from "@api/bops-functions/prebuilt-functions/prebuilt-functions-map";
import { ProvidedFunctionNotFound } from "@api/bops-functions/bops-engine/engine-errors/function-not-found";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { BopsConfigurationEntry } from "@api/configuration/business-operations/business-operations-type";
import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";

export interface ModuleResolverInputs {
  ExternalFunctionManager : FunctionManager;
  SchemasManager : SchemasManager;
}

enum RepoStartingCharacter {
  schemaFunctions = "@",
  internalFunctions = "#",
  externalFunctions = ":",
}
// Internal Bops (stating with '+') and Bop Output (starting with '%') are resolved separately

export type ModuleResolverType = {
  [char in RepoStartingCharacter] : (module : BopsConfigurationEntry) => Promise<Function>;
}

export class ModuleResolver {
  private externalFunctionManager : FunctionManager;
  private schemasManager : SchemasManager;

  constructor (options : ModuleResolverInputs)  {
    this.externalFunctionManager = options.ExternalFunctionManager;
    this.schemasManager = options.SchemasManager;
  }

  public resolve : ModuleResolverType = {
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
      const foundFunction = PrebuiltFunctions.get(functionName);
      if(!foundFunction) throw new ProvidedFunctionNotFound(module.moduleRepo);
      return foundFunction;
    },

    ":" : async (module) : Promise<Function> => {
      return this.externalFunctionManager.get(module.moduleRepo.slice(1));
    },
  }
}
