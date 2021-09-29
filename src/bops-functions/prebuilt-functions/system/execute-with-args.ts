import { CloudedObject } from "../../../common/types/clouded-object";
import { InternalMetaFunction } from "../../internal-meta-function";

export const executeWithArgs = async (input : { module : Function; arguments : CloudedObject }) : Promise<unknown> => {
  const moduleOutput = await input.module(input.arguments);
  return { moduleOutput };
};

export const executeWithArgsFunctionInformation : InternalMetaFunction = {
  functionName: "executeWithArgs",
  description: "Gets a function from a functionManager",
  inputParameters: {
    module: { type: "function", required: true },
    arguments: { type: "cloudedObject", required: true },
  },
  version: "1.0.0",
  outputData: {
    moduleOutput: { type: "any", required: false },
  },
};
