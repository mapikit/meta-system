import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import PrebuiltFunctions from "@api/bops-functions/prebuilt-functions/prebuilt-functions-map";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { ProvidedFunctionNotFound } from "@api/bops-functions/bops-engine/engine-errors/function-not-found";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { BopsConfigurationEntry } from "@api/configuration/business-operations/business-operations-type";

export interface ModuleResolverInputs {
  FunctionsInstaller : FunctionsInstaller;
  FunctionsFileSystem : FunctionFileSystem;
  SchemasManager : SchemasManager;
}

enum RepoStartingCharacter {
  schemaFunctions = "@",
  internalFunctions = "#",
  externalFunctions = "%",
  bopEngine = "+"
}

export type ModuleResolverType = {
  [char in RepoStartingCharacter] : (module : BopsConfigurationEntry) => Promise<Function>;
}

export class ModuleResolver {
  private functionsInstaller : FunctionsInstaller;
  private functionsFileSystem : FunctionFileSystem;
  private schemasManager : SchemasManager;

  constructor (options : ModuleResolverInputs)  {
    this.functionsFileSystem = options.FunctionsFileSystem;
    this.functionsInstaller = options.FunctionsInstaller;
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

    "%" : async (module) : Promise<Function> => {
      const moduleName = module.moduleRepo.slice(1);
      await this.functionsInstaller.install(moduleName, module.version, ModuleKind.NPM);
      const functionJson = await this.functionsFileSystem.getFunctionDescriptionFile(moduleName);
      const externalFunctionConfig = JSON.parse(functionJson);
      const mainFunction = await this.functionsFileSystem.importMain(
        moduleName,
        externalFunctionConfig.entrypoint,
        externalFunctionConfig.mainFunction,
      );
      return mainFunction;
    },

    "+" : async () : Promise<Function> => {
      return undefined;
    },
  }
}
