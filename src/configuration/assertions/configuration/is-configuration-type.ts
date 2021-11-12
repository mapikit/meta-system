import { ConfigurationType } from "../../configuration-type";
import { PathUtils } from "../../path-alias-utils";
import { isType } from "../is-type";
import { isEnvironmentVariable } from "./is-environment-variable";

// eslint-disable-next-line max-lines-per-function
export function isConfigurationType (input : unknown) : asserts input is ConfigurationType {
  isType("object", "Input should be an object", input);

  const configurationTypeInput = input as ConfigurationType;

  isType("string", "\"dbConnectionString\" should be a string", configurationTypeInput.dbConnectionString);
  isType("string", "\"name\" should be a string", configurationTypeInput.name);
  isType("string", "\"version\" should be a string", configurationTypeInput.version);

  if (!Array.isArray(configurationTypeInput.envs)) {
    throw Error("\"envs\" should be an array");
  }

  configurationTypeInput.envs.forEach((envEntry) => {
    isEnvironmentVariable(envEntry);
  });

  const businessOperations = PathUtils.getContent(configurationTypeInput.businessOperations);
  if (!Array.isArray(businessOperations)) {
    throw Error("\"businessOperations\" should be an array");
  }

  const schemas = PathUtils.getContent(configurationTypeInput.schemas);
  if (!Array.isArray(schemas)) {
    throw Error("\"schemas\" should be an array");
  }

  const protocols = PathUtils.getContent(configurationTypeInput.protocols);
  if (!Array.isArray(protocols)) {
    throw Error("\"protocols\" should be an array");
  }
}
