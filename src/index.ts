import { FunctionSetup } from "./bootstrap/function-setup.js";
import { BopsManagerClass } from "./bops-functions/function-managers/bops-manager.js";
import { ExternalFunctionManagerClass,
  externalFunctionManagerSingleton } from "./bops-functions/function-managers/external-function-manager.js";
import internalFunctionManager,
{ InternalFunctionManagerClass } from "./bops-functions/function-managers/internal-function-manager.js";
import { ConfigurationType as config } from "./configuration/configuration-type.js";

export type ConfigurationType = config;

export default {
  ExternalFunctionManagerClass,
  externalFunctionManagerSingleton: externalFunctionManagerSingleton,
  InternalFunctionManagerClass,
  internalFunctionManagerSingleton: internalFunctionManager,
  BopsManagerClass,
  FunctionSetup,
};
