import { EnvironmentVariable } from "@api/configuration/configuration-type";
import { isType } from "@api/configuration/assertions/is-type";

export function isEnvironmentVariable (input : unknown) : asserts input is EnvironmentVariable {
  isType("object", "Every entry of \"envs\" should be an object", input);

  const enviromentVariableInput = input as EnvironmentVariable;

  isType("string", "\"key\" should be string", enviromentVariableInput.key);
  isType("string", "\"value\" should be string", enviromentVariableInput.value);
}