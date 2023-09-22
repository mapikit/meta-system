import { SystemSetup as _SystemSetup } from "./bootstrap/system-setup.js";
import { FunctionSetup as _FunctionSetup } from "./bootstrap/function-setup.js";
import { ConfigurationType as config } from "./configuration/configuration-type.js";

export type ConfigurationType = config;

export const FunctionSetup = _FunctionSetup;
export const SystemSetup = _SystemSetup;
