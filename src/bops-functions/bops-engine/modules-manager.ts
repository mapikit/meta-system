import { BopsConfigurationEntry } from "@api/configuration/business-operations/business-operations-type";
import {
  ModuleResolver,
  ModuleResolverInputs } from "@api/bops-functions/bops-engine/module-resolver";
import { ConfigurationType } from "@api/configuration/configuration-type";

export type MappedFunctions = Map<string, Function>;

export class ModuleManager {
  private moduleResolver : ModuleResolver;

  constructor (options : ModuleResolverInputs) {
    this.moduleResolver = new ModuleResolver(options);
  }

  private async resolveModule (module : BopsConfigurationEntry) : Promise<Function> {
    const startingChar = module.moduleRepo[0];
    return this.moduleResolver.resolve[startingChar](module);
  }

  private async resolveModules (modules : BopsConfigurationEntry[], existingMap : Map<string, Function>)
    : Promise<void> {
    for(const module of modules) {
      const isNotOutput = module.moduleRepo[0] !== "%";
      if(!existingMap.has(module.moduleRepo) && isNotOutput) {
        existingMap.set(module.moduleRepo, await this.resolveModule(module));
      }
    }
  }

  public async resolveSystemModules (systemConfig : ConfigurationType) : Promise<MappedFunctions> {
    const systemBops = systemConfig.businessOperations;
    const functionMap = new Map<string, Function>();
    for(const bop of systemBops) {
      await this.resolveModules(bop.configuration, functionMap);
    }
    return functionMap;
  }
}



