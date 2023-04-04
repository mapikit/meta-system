import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const updateByIdInfo : InternalMetaFunction = {
  functionName: "updateById",
  description: "Updates the values of properties of an entity based on a provided ID.",
  author: "mapikit",
  version: "0.0.1",
  input: {
    id: { type: "string", required: true },
    data: { type: "cloudedObject", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
  },
  customTypes: [],
};
