import { BopsConfigurationEntry, ModuleType } from "../../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../../configuration/configuration-type";
import { ModuleResolver, ModuleResolverInputs } from "./module-resolver";

export type MappedFunctions<T extends ModuleType = ModuleType> = Map<ModuleFullName<T>, Function>;
export type ModuleFullName<T extends ModuleType = ModuleType> = `${T}.${string}.${string}` | `${T}.${string}`;

export class ModuleManager {
  private moduleResolver : ModuleResolver;

  constructor (options : ModuleResolverInputs) {
    this.moduleResolver = new ModuleResolver(options);
  }

  private resolveModule (module : BopsConfigurationEntry) : Function {
    return this.moduleResolver.resolve[module.moduleType](module);
  }

  private resolveModules (modules : BopsConfigurationEntry[], existingMap : Map<ModuleFullName, Function>)
    : void {
    for(const module of modules) {
      const isRegularModule = !["output", "variable"].includes(module.moduleType);
      const fullName = ModuleManager.getFullModuleName(module);
      if(!existingMap.has(fullName) && isRegularModule) {
        existingMap.set(fullName, this.resolveModule(module));
      }
    }
  }

  public resolveSystemModules (systemConfig : ConfigurationType) : MappedFunctions {
    const systemBops = systemConfig.businessOperations;
    const functionMap = new Map<ModuleFullName, Function>();
    for(const bop of systemBops) {
      this.resolveModules(bop.configuration, functionMap);
    }
    return functionMap;
  }

  public static getFullModuleName (module : BopsConfigurationEntry) : ModuleFullName {
    if(module.modulePackage !== undefined) {
      return `${module.moduleType}.${module.modulePackage}.${module.moduleName}` as ModuleFullName;
    } else return `${module.moduleType}.${module.moduleName}` as ModuleFullName;
  }
}



