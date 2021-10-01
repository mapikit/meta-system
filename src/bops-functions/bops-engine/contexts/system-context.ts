import { ConfigurationType } from "../../../configuration/configuration-type";
import { BopsVariable } from "../../../configuration/business-operations/business-operations-type";
import { MappedFunctions, ModuleManager } from "../modules-manager";
import { ResolvedConstants, StaticSystemInfo } from "../static-info-validation";
import { VariableContext } from "../variables/variables-context";

export class SystemContext {
  public readonly constants : Record<string, ResolvedConstants>;
  public readonly variables : Record<string, BopsVariable[]>;
  public readonly moduleManager : ModuleManager;
  public mappedFunctions ?: MappedFunctions;
  public readonly config : ConfigurationType;

  public constructor (options : {
    ModuleManager : ModuleManager;
    SystemConfig : ConfigurationType;
  }) {
    this.constants = StaticSystemInfo.validateSystemStaticInfo(options.SystemConfig);
    this.variables = VariableContext.validateSystemVariables(options.SystemConfig);
    this.moduleManager = options.ModuleManager;
    this.config = options.SystemConfig;
  }

  public get hasMappedFunctions () : boolean {
    return this.mappedFunctions !== undefined;
  }

  public generateMappedFunctions () : void {
    this.mappedFunctions = this.moduleManager.resolveSystemModules(this.config);
  }
}
