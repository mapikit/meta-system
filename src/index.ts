import { ExternalFunctionManagerClass, externalFunctionManagerSingleton }
  from "@api/bops-functions/function-managers/external-function-manager";
import internalFunctionManager, { InternalFunctionManagerClass }
  from "@api/bops-functions/function-managers/internal-function-manager";
import { BopsManagerClass } from "@api/bops-functions/function-managers/bops-manager";
import { FunctionSetup } from "@api/bootstrap/function-setup";
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
