import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const tryCatchBopsFunction = async (input : { function : Function }) : Promise<unknown> => {
  try {
    return { result: input.function() };
  } catch (error) {
    return { error };
  }
};

export const tryCatchBopsFunctionInformation : InternalMetaFunction = {
  functionName: "tryCatchBopsFunction",
  version: "1.0.0",
  description: "Tries to execute a function, returning the result or error, if present",
  inputParameters: {
    function : { type: "function", required: true },
  },
  outputData: {
    result: { type: "any", required: false },
    error: { type: "any", required: false },
  },
};
