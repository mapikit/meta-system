import { BopsConfigurationEntry } from "../../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../../configuration/configuration-type";
import { ModuleResolver, ModuleResolverInputs } from "./module-resolver";

export type MappedFunctions = Map<string, Function>;

export class ModuleManager {
  private moduleResolver : ModuleResolver;

  constructor (options : ModuleResolverInputs) {
    this.moduleResolver = new ModuleResolver(options);
  }

  private resolveModule (module : BopsConfigurationEntry) : Function {
    return this.moduleResolver.resolve[module.moduleType](module);
  }

  private resolveModules (modules : BopsConfigurationEntry[], existingMap : Map<string, Function>)
    : void {
    for(const module of modules) {
      const isRegularModule = !["output", "variable"].includes(module.moduleType);
      if(!existingMap.has(module.moduleName) && isRegularModule) {
        existingMap.set(module.moduleName, this.resolveModule(module));
      }
    }
  }

  public resolveSystemModules (systemConfig : ConfigurationType) : MappedFunctions {
    const systemBops = systemConfig.businessOperations;
    const functionMap = new Map<string, Function>();
    for(const bop of systemBops) {
      this.resolveModules(bop.configuration, functionMap);
    }
    return functionMap;
  }
}



