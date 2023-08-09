import { EntityBroker } from "../../broker/entity-broker.js";
import { BopsConfigurationEntry } from "../../configuration/business-operations/business-operations-type.js";

enum ModuleTypes {
  schemaFunctions = "schemaFunction",
  internalFunctions = "internal",
  addonFunctions = "addon",
  bops = "bop"
}
// Internal Bops (embedded) and Bop Outputs are resolved separately

export type ModuleResolverType = {
  [char in ModuleTypes] : (module : BopsConfigurationEntry) => Function;
}

export class ModuleResolver {
  constructor (private readonly systemFunctionsBroker : EntityBroker)  {

  }

  public resolve : ModuleResolverType = {
    "addon": (module) : Function => {
      return this.systemFunctionsBroker.addonsFunctions
        .getAddonFunction(module.modulePackage, module.moduleName);
    },
    "bop": (module) : Function => {
      return this.systemFunctionsBroker.bopFunctions
        .getBopFunction(module.moduleName);
    },
    "schemaFunction": (module) : Function => {
      const schema = module.modulePackage;
      const operation = module.moduleName;

      return this.systemFunctionsBroker.schemaFunctions
        .getSchemaFunction(operation, schema);
    },
    "internal" : (module) : Function => {
      const functionName = module.moduleName;
      return this.systemFunctionsBroker.internalFunctions
        .getFunction(functionName);
    },
  };
}
