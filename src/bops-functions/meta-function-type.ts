import { ObjectDefinition } from "@meta-system/object-definition";

export interface MetaFunction extends FunctionDefinition {
  description ?: string;
  author ?: string;
  version ?: string;
  entrypoint : string;
  mainFunction : string;
}

export interface FunctionDefinition {
  input : ObjectDefinition;
  output : ObjectDefinition;
  functionName : string;
}
