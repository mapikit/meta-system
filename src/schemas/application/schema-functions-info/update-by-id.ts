import { InternalMetaFunction } from "bops-functions/internal-meta-function";

export const updateByIdInfo : InternalMetaFunction = {
  functionName: "updateById",
  description: "Updates the values of properties of an entity based on a provided ID.",
  author: "mapikit",
  version: "0.0.1",
  input: {
    id: { type: "string", required: true },
    valuesToUpdate: { type: "cloudedObject", required: true },
  },
  output: {
    updateError: { type: "$errorMessage", required: false },
    updatedEntity: { type: "%entity", required: false },
  },
  customTypes: [
    {
      name: "errorMessage",
      type: {
        message: { type: "string" },
        errorCode: { type: "string" },
      },
    },
  ],
};
