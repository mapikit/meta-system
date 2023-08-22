import type { ObjectDefinition } from "@meta-system/object-definition";
import type { Addon } from "../configuration/addon-type.js";
import type { FunctionEntity } from "./functions-context.js";
import type { Schema } from "../configuration/schemas/schema.js";
import type { BusinessOperation } from "../configuration/business-operations/business-operation.js";
import type { EnvironmentVariableEntity } from "./system-context.js";
import type { EnvironmentVariable } from "../configuration/configuration-type.js";

export type FunctionDefinition = {
  functionName : string;
  input : ObjectDefinition;
  output : ObjectDefinition;
  author ?: string;
  description ?: string;
}

// These types are to be used by addons, to aid in their development (dev dependency)
type AddonsBrokerFunctions = {
  getAddon : (addonIdentifier : string) => Addon;
  createAddon : (addon : Addon) => void;
  getAll : () => Addon[];
};

type AddonsFunctionsBrokerFunctions = {
  getFunction : (functionName : string) => Function;
  getAddonFunction : (addonIdentifier : string, functionName : string) => Function;
  getAll : () => FunctionEntity[];
  register : (callable : Function, definition : FunctionDefinition) => void;
  preregister : (definition : FunctionDefinition) => void;
  setRegistered : (functionName : string, callable : Function) => void;
};

type SchemaBrokerFunctions = {
  getSchema : (schemaIdentifier : string) => Schema;
  createSchema : (schema : Schema) => void;
  getAll : () => Schema[];
  modifySchema : (schema : Schema) => void;
};

type SchemaFunctionsBrokerFunctions = {
  preRegisterSchemaFunction : (schemaIdentifier : string, definition : FunctionDefinition) => void;
  setRegisteredSchemaFunction : (schemaIdentifier : string, functionName : string, callable : Function) => void;
  setSchemaFunction : (schemaIdentifier : string, callable : Function, definition : FunctionDefinition) => void;
  getSchemaFunction : (functionName : string, schemaIdentifier : string) => Function;
};

type BusinessOperationsBrokerFunctions = {
  getBop : (bopIdentifier : string) => void;
  createBop : (bop : typeof BusinessOperation) => void;
  getAll : () => typeof BusinessOperation[];
};

type BopsFunctionsBrokerFunctions = {
  overrideBopCall : (bopIdentifier : string, callable : Function, definition : FunctionDefinition) => void;
  addBopCall : (bopIdentifier : string, callable : Function, definition : FunctionDefinition) => void;
  getBopFunction : (bopIdentifier : string) => Function;
};

type EnvsBrokerFunctions = {
  getEnv : (envKey : string) => EnvironmentVariableEntity;
  createEnv : (env : EnvironmentVariable) => void;
  getAll : () => EnvironmentVariableEntity[];
};

type InternalFunctionsBrokerFunctions = {
  setFunction : (callable : Function, definition : FunctionDefinition) => void;
  getFunction : (functionName : string) => Function;
  override : (functionName : string, callable : Function) => void;
};

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

export type ConfigureFunction<T extends object, Y> = (broker : BrokerType, configuration : T) => Y
export type BootFunction<T> = (broker : BrokerType, context : T) => void;
