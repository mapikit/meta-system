import { ConfigurationType } from "../../configuration-type.js";
import { isType } from "../is-type.js";
import { isEnvironmentVariable } from "./is-environment-variable.js";

// eslint-disable-next-line max-lines-per-function
export function isConfigurationType (input : unknown) : asserts input is ConfigurationType {
  isType("object", "Input should be an object", input);

  const configurationTypeInput = input as ConfigurationType;

  isType("string", "\"name\" should be a string", configurationTypeInput.name);
  isType("string", "\"version\" should be a string", configurationTypeInput.version);

  if (!Array.isArray(configurationTypeInput.envs)) {
    throw Error("\"envs\" should be an array");
  }

  configurationTypeInput.envs.forEach((envEntry) => {
    isEnvironmentVariable(envEntry);
  });

  if (!Array.isArray(configurationTypeInput.businessOperations)) {
    throw Error("\"businessOperations\" should be an array");
  }

  if (!Array.isArray(configurationTypeInput.schemas)) {
    throw Error("\"schemas\" should be an array");
  }

  if (!Array.isArray(configurationTypeInput.protocols)) {
    throw Error("\"protocols\" should be an array");
  }
}
