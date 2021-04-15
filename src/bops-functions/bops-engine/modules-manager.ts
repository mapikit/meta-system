import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import {
  MappedFunctions,
  ModuleManagerFileSystem,
  ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-types";
import { moduleResolver } from "@api/bops-functions/bops-engine/module-resolver";

export class ModuleManager {
  private schemasManager : SchemasManager;
  private files : ModuleManagerFileSystem;

  constructor (options : {
    SchemaManager : SchemasManager;
    FunctionsInstaller : FunctionsInstaller;
    FunctionsFileSystem : FunctionFileSystem;
  }) {
    this.files = {
      installer : options.FunctionsInstaller,
      externalFunctions: options.FunctionsFileSystem,
    };

    this.schemasManager = options.SchemaManager;
  }

  public async resolveModules (modules : BopsConfigurationEntry[]) : Promise<MappedFunctions> {
    const mappedModules = new Map<string, ModuleResolverOutput>();
    for(const module of modules) {
      if(!mappedModules.get(module.moduleRepo)) {
        const startingChar = module.moduleRepo[0];
        mappedModules.set(module.moduleRepo, await moduleResolver[startingChar]({
          moduleName: module.moduleRepo.slice(1),
          moduleVersion: module.version,
          fileManager: this.files,
          schemasManager: this.schemasManager,
        }));
      }
    }
    return mappedModules;
  }
}



