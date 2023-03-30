import { InternalMetaFunction } from "../../internal-meta-function.js";

export const dateNowBopsFunction = () : { now : Date } => {
  return { now: new Date(Date.now()) };
};

export const dateNowBopsFunctionInformation : InternalMetaFunction = {
  functionName: "dateNow",
  version: "1.0.0",
  description: "Gets the current date.",
  output: {
    now: { type: "date", required: true },
  },
  input: {},
};
