import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const countInfo : InternalMetaFunction = {
  functionName: "count",
  description: "Count how many entities match the given query",
  author: "mapikit",
  version: "0.0.1",
  input: {
    query : { type: "cloudedObject", required: true },
  },
  output: {
    count: { type: "number", required: false },
    success: { type: "boolean", required: true },
  },
  customTypes: [],
};
