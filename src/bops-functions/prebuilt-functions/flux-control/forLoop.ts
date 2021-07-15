import { InternalMetaFunction } from "../../internal-meta-function";

export const forLoopFunction = async (input : {
  quantity : number;
  module : Function;
  postEach ?: Function;
  postAll ?: Function
}) : Promise<unknown> => {
  if(typeof input.quantity !== "number") return { errorMessage: "property \"quantity\" must be a number" };

  let i : number;
  for(i = 0; i <= input.quantity-1; i++) {
    await input.module();
    await input.postEach();
  }
  await input.postAll();
  return ({ lastIndexValue: i });
};

export const forLoopInformation : InternalMetaFunction = {
  functionName: "forLoopFunction",
  version: "1.0.0",
  description: "Executes a module n times and a (optional) secundary module after each execution." +
  "Optionally executes a third module once the loop is done",
  inputParameters: {
    quantity: { type: "number", required: true },
    module: { type: "function", required: true },
    postEach: { type: "function", required: false },
    postAll: { type: "function", required: false },
  },
  outputData: {
    lastIndexValue: { type: "number", required: true },
  },
};
