import { OperationNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/operation-not-found-error";
import { SchemaNotFoundError } from "@api/bops-functions/bops-engine/engine-errors/schema-not-found-error";
import { schemaFunctionsConfig } from "@api/schemas/domain/schema-functions-map";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import PrebuiltFunctions from "@api/bops-functions/prebuilt-functions/prebuilt-functions-map";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { ProvidedFunctionNotFound } from "@api/bops-functions/bops-engine/engine-errors/function-not-found";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { OutputData } from "meta-function-helper";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";
import { bopsEngineInfo } from "@api/bops-functions/bops-engine/meta-function";

export interface ModuleResolverInputs {
  FunctionsInstaller : FunctionsInstaller;
  FunctionsFileSystem : FunctionFileSystem;
  SchemasManager : SchemasManager;
}

export interface ModuleResolverOutput {
  main : Function;
  outputData : OutputData[];
}

enum RepoStartingCharacter {
  schemaFunctions = "@",
  internalFunctions = "#",
  externalFunctions = "%",
  bopEngine = "+"
}

export type ModuleResolverType = {
  [char in RepoStartingCharacter] : (module : BopsConfigurationEntry) => Promise<ModuleResolverOutput>;
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
    "@": async (module) : Promise<ModuleResolverOutput> => {
      const moduleName = module.moduleRepo.slice(1);
      const [schema, operation] = moduleName.split("@");
      if(!Object.keys(SchemasFunctions).includes(operation)) throw new OperationNotFoundError(operation, schema);

      const operationOutput = schemaFunctionsConfig.get(operation).outputData;
      const schemaToLook = this.schemasManager.schemas.get(schema);
      if(!schemaToLook) throw new SchemaNotFoundError(schema);

      return {
        main: schemaToLook.bopsFunctions[operation],
        outputData: operationOutput,
      };
    },

    "#" : async (module) : Promise<ModuleResolverOutput> => {
      const functionName = module.moduleRepo.slice(1);
      const foundFunction = PrebuiltFunctions.get(functionName);
      if(!foundFunction) throw new ProvidedFunctionNotFound(module.moduleRepo);
      return {
        main: foundFunction.main,
        outputData: foundFunction.outputData,
      };
    },

    "%" : async (module) : Promise<ModuleResolverOutput> => {
      const moduleName = module.moduleRepo.slice(1);
      await this.functionsInstaller.install(moduleName, module.version, ModuleKind.NPM);
      const functionJson = await this.functionsFileSystem.getFunctionDescriptionFile(moduleName);
      const externalFunctionConfig = JSON.parse(functionJson);
      const mainFunction = await this.functionsFileSystem.importMain(
        moduleName,
        externalFunctionConfig.entrypoint,
        externalFunctionConfig.mainFunction,
      );
      return {
        main: mainFunction,
        outputData: externalFunctionConfig.outputData,
      };
    },

    "+" : async () : Promise<ModuleResolverOutput> => {
      return {
        main: undefined, // Will be defined after BopsEngine instantiation
        outputData: bopsEngineInfo.outputData,
      };
    },
  }
}
