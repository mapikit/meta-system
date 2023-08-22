import { EntityBroker } from "../../broker/entity-broker.js";
import { BopsConfigurationEntry, ModuleType } from
  "../../configuration/business-operations/business-operations-type.js";
import { ConfigurationType } from "../../configuration/configuration-type.js";
import { FunctionNotFoundError } from "./engine-errors/function-not-found.js";
import { ModuleResolver } from "./module-resolver.js";

export type MappedFunctions<T extends ModuleType = ModuleType> = Map<ModuleFullName<T>, Function>;
export type ModuleFullName<T extends ModuleType = ModuleType> = `${T}.${string}.${string}` | `${T}.${string}`;

export class ModuleManager {
  private moduleResolver : ModuleResolver;

  constructor (systemFunctionsBroker : EntityBroker) {
    this.moduleResolver = new ModuleResolver(systemFunctionsBroker);
  }

  private resolveModule (module : BopsConfigurationEntry) : Function {
    const result = this.moduleResolver.resolve[module.moduleType](module);
    // Bop modules are generated sequentially.
    // We ensure their generation order at the FunctionSetup.buildBops() function.
    if (!result && module.moduleType !== "bop") {
      throw new FunctionNotFoundError(module);
    }

    return result;
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



