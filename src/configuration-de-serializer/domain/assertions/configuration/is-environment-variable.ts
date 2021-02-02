import { EnvironmentVariable } from "@api/configuration-de-serializer/domain/configuration-type";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";

export function isEnvironmentVariable (input : unknown) : asserts input is EnvironmentVariable {
  isType("object", "Every entry of \"envs\" should be an object", input);

  const enviromentVariableInput = input as EnvironmentVariable;

  isType("string", "\"key\" should be string", enviromentVariableInput.key);
  isType("string", "\"value\" should be string", enviromentVariableInput.value);
}
