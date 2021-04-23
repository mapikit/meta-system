import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { moduleResolver, ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-resolver";
import { ConfigurationType } from "@api/configuration-de-serializer/domain/configuration-type";

export type MappedFunctions = Map<string, ModuleResolverOutput>;

export class ModuleManager {
  private schemasManager : SchemasManager;
  private functionsInstaller : FunctionsInstaller;
  private functionsFileSystem : FunctionFileSystem;

  constructor (options : {
    SchemaManager : SchemasManager;
    FunctionsInstaller : FunctionsInstaller;
    FunctionsFileSystem : FunctionFileSystem;
  }) {
    this.functionsFileSystem = options.FunctionsFileSystem;
    this.functionsInstaller = options.FunctionsInstaller;
    this.schemasManager = options.SchemaManager;
  }

  private async resolveModule (module : BopsConfigurationEntry) : Promise<ModuleResolverOutput> {
    const startingChar = module.moduleRepo[0];
    return moduleResolver[startingChar]({
      module: module,
      functionsInstaller: this.functionsInstaller,
      functionsFileSystem: this.functionsFileSystem,
      schemasManager: this.schemasManager,
    });
  }

  public async resolveModules (modules : BopsConfigurationEntry[]) : Promise<MappedFunctions> {
    const mappedModules = new Map<string, ModuleResolverOutput>();
    for(const module of modules) {
      if(!mappedModules.get(module.moduleRepo)) {
        mappedModules.set(module.moduleRepo, await this.resolveModule(module));
      }
    }
    return mappedModules;
  }

  public async resolveSystemModules (systemConfig : ConfigurationType) : Promise<MappedFunctions> {
    const systemBops = systemConfig.businessOperations;
    const functionMap = new Map<string, ModuleResolverOutput>();
    for(const bop of systemBops) {
      const bopFunctions = await this.resolveModules(bop.configuration);
      bopFunctions.forEach((funct, key) => {
        functionMap.set(key, funct);
      });
    }
    return functionMap;
  }
}



