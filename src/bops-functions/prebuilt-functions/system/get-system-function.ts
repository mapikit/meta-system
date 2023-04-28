import { InternalMetaFunction } from "../../internal-meta-function.js";

// This is just a stub function to be inserted in the manager. The true definition
// of this function is in the FunctionSetup Class

export const getSystemFunction = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _input : { moduleName : string; modulePackage : string; moduleType : string },
) : unknown => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () : void => {};
};

export const getSystemFunctionFunctionInformation : InternalMetaFunction = {
  functionName: "getSystemFunction",
  description: "Gets a function from a functionManager",
  input: {
    moduleName: { type: "string", required: true },
    modulePackage: { type: "string", required: false },
    moduleType: { type: "string", required: true },
  },
    output: {
    callableFunction: { type: "function", required: false },
    found: { type: "boolean", required: true },
  },
};
