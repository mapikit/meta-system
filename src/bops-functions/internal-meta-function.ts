import { MetaFunction } from "@meta-system/meta-function-helper";

export type InternalMetaFunction = Omit<MetaFunction, "entrypoint" | "mainFunction" | "version">;

// This section is just to ensure that the interfaces are interchangeable when MetaFunction
// is correcly fulfilled.
const metaFunctionType : MetaFunction = {
  functionName: "",
  description: "this is a test meta-function",
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
  input: {
    numberToRound: { type: "number", required: true },
    precision: { type: "number", required: false },
  },
  entrypoint: "",
  mainFunction: "",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const convertedMetaFunction : InternalMetaFunction = metaFunctionType;
