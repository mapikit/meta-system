import { InternalMetaFunction } from "../../internal-meta-function";

export const dateNowBopsFunction = () : { now : Date } => {
  return { now: new Date(Date.now()) };
};

export const dateNowBopsFunctionInformation : InternalMetaFunction = {
  functionName: "dateNowBopsFunction",
  version: "1.0.0",
  description: "Gets the current date.",
  outputData: {
    now: { type: "date", required: true },
  },
};
