import { FunctionSetup } from "./bootstrap/function-setup";
import { BopsManagerClass } from "./bops-functions/function-managers/bops-manager";
import { ExternalFunctionManagerClass,
  externalFunctionManagerSingleton } from "./bops-functions/function-managers/external-function-manager";
import internalFunctionManager,
{ InternalFunctionManagerClass } from "./bops-functions/function-managers/internal-function-manager";
import { ConfigurationType as config } from "./configuration/configuration-type";

export type ConfigurationType = config;

export default {
  ExternalFunctionManagerClass,
  externalFunctionManagerSingleton: externalFunctionManagerSingleton,
  InternalFunctionManagerClass,
  internalFunctionManagerSingleton: internalFunctionManager,
  BopsManagerClass,
  FunctionSetup,
};
