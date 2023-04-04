import { EnvironmentVariable } from "../../configuration-type.js";
import { isType } from "../is-type.js";

export function isEnvironmentVariable (input : unknown) : asserts input is EnvironmentVariable {
  isType("object", "Every entry of \"envs\" should be an object", input);

  const enviromentVariableInput = input as EnvironmentVariable;

  isType("string", "\"key\" should be string", enviromentVariableInput.key);
  isType("string", "\"value\" should be string", enviromentVariableInput.value);
}
