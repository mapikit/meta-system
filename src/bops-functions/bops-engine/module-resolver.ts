import { BopsConfigurationEntry } from "../../configuration/business-operations/business-operations-type";
import { SchemasManager } from "../../schemas/application/schemas-manager";
import { SchemasFunctions } from "../../schemas/domain/schemas-functions";
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

enum ModuleTypes {
  schemaFunctions = "schemaFunction",
  internalFunctions = "internal",
  externalFunctions = "external",
  bops = "bop"
}
// Internal Bops (embedded) and Bop Outputs are resolved separately

export type ModuleResolverType = {
  [char in ModuleTypes] : (module : BopsConfigurationEntry) => Function;
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
    "bop": (module) : Function => {
      const result = this.bopsManager.get(module.moduleRepo);

      return result;
    },
    "schemaFunction": (module) : Function => {
      const schema = module.modulePackage;
      const operation = module.moduleRepo;
      if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

      const schemaToLook = this.schemasManager.schemas.get(schema);
      if(!schemaToLook) throw new SchemaNotFoundError(schema);

      return schemaToLook.bopsFunctions[operation];
    },

    "internal" : (module) : Function => {
      const functionName = module.moduleRepo;
      const foundFunction = this.internalFunctionManager.get(functionName);
      if(!foundFunction) throw new ProvidedFunctionNotFound(module.moduleRepo);
      return foundFunction;
    },

    "external" : (module) : Function => {
      if (module.modulePackage !== undefined) {
        return this.externalFunctionManager.get(`${module.modulePackage}.${module.moduleRepo}`);
      }

      return this.externalFunctionManager.get(module.moduleRepo);
    },
  }
}
