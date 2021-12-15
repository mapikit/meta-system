import { InternalMetaFunction } from "../../internal-meta-function";

export const tryCatchBopsFunction = async (input : { function : Function }) : Promise<unknown> => {
  try {
    return { result: input.function() };
  } catch (error) {
    return { error };
  }
};

export const tryCatchBopsFunctionInformation : InternalMetaFunction = {
  functionName: "tryCatch",
  version: "1.0.0",
  description: "Tries to execute a function, returning the result or error, if present",
  input: {
    function : { type: "function", required: true },
  },
  output: {
    result: { type: "any", required: false },
    error: { type: "any", required: false },
  },
};
