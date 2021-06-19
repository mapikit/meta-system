import { BopsConfigurationEntry } from "@api/configuration/domain/business-operations-type";
import {
  ModuleResolver,
  ModuleResolverInputs,
  ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-resolver";
import { ConfigurationType } from "@api/configuration/domain/configuration-type";

export type MappedFunctions = Map<string, ModuleResolverOutput>;

export class ModuleManager {
  private moduleResolver : ModuleResolver;

  constructor (options : ModuleResolverInputs) {
    this.moduleResolver = new ModuleResolver(options);
  }

  private async resolveModule (module : BopsConfigurationEntry) : Promise<ModuleResolverOutput> {
    const startingChar = module.moduleRepo[0];
    return this.moduleResolver.resolve[startingChar](module);
  }

  private async resolveModules (modules : BopsConfigurationEntry[], existingMap : Map<string, ModuleResolverOutput>)
    : Promise<void> {
    for(const module of modules) {
      if(!existingMap.get(module.moduleRepo)) {
        existingMap.set(module.moduleRepo, await this.resolveModule(module));
      }
    }
  }

  public async resolveSystemModules (systemConfig : ConfigurationType) : Promise<MappedFunctions> {
    const systemBops = systemConfig.businessOperations;
    const functionMap = new Map<string, ModuleResolverOutput>();
    for(const bop of systemBops) {
      await this.resolveModules(bop.configuration, functionMap);
    }
    return functionMap;
  }
}



