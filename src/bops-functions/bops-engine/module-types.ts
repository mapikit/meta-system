import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { OutputData } from "meta-function-helper";

export type MappedFunctions = Map<string, ModuleResolverOutput>;

export interface ModuleManagerFileSystem {
  installer : FunctionsInstaller;
  schemaFunctions : FunctionFileSystem;
  externalFunctions : FunctionFileSystem;
}

export interface ModuleResolverOutput {
  main : Function;
  outputData : OutputData[];
}

type ModuleResolutionInput = {
  moduleName : string;
  moduleVersion : string;
  fileManager : ModuleManagerFileSystem;
  schemasManager : SchemasManager;
}

export interface ModuleResolverType {
  [repoStartingCharacter : string] : (input : ModuleResolutionInput) => Promise<ModuleResolverOutput>;
}
