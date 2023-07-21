import { Addon } from "../configuration/addon-type.js";

// This type is to be used by addons, to aid in their development (dev dependency)
type AddonsBrokerFunctions = {
  getAddon : (addonIdentifier : string) => Addon;
  createAddon : (addon : Addon) => void;
  getAll : () => Addon[];
};

type AddonsFunctionsBrokerFunctions = {
  
};

type SchemaBrokerFunctions = {};

type SchemaFunctionsBrokerFunctions = {};

type BusinessOperationsBrokerFunctions = {};

type BopsFunctionsBrokerFunctions = {};

type EnvsBrokerFunctions = {};

type InternalFunctionsBrokerFunctions = {};

/**
 * Support type for intellisense support for Brokers.
 *
 * Because of the permissions requirements, not all functions declared here will
 * be present in the object. Refer to the Meta-System documentation for more information.
 */
export type BrokerType = {
  addons : AddonsBrokerFunctions;
  addonsFunctions : AddonsFunctionsBrokerFunctions;
  schemas : SchemaBrokerFunctions;
  schemaFunctions : SchemaFunctionsBrokerFunctions;
  businessOperations : BusinessOperationsBrokerFunctions;
  bopsFunctions : BopsFunctionsBrokerFunctions;
  envs : EnvsBrokerFunctions;
  internalFunctions : InternalFunctionsBrokerFunctions;
  done : () => void;
}
