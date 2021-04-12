/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomType, InputParameters, MetaFunction, OutputBranches, OutputData } from "meta-function-helper";

export interface InternalMetaFunction {
  functionName : string;
  description : string;
  version : string;
  inputParameters : InputParameters[];
  outputBranches : OutputBranches[];
  outputData : OutputData[];
  customTypes : CustomType[];
};

// This section is just to ensure that the interfaces are interchangeable when MetaFunction
// is correcly fulfilled.
const metaFunctionType : MetaFunction = {
  functionName: "",
  version: "1.0.0",
  description: "this is a test meta-function",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorMessage",
      branch: "notANumber",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
  ],
  inputParameters: [
    { name: "numberToRound", type: "number" },
    { name: "precision", type: "number", required: false },
  ],
  customTypes: [],
  entrypoint: "",
  mainFunction: "",
};

const convertedMetaFunction : InternalMetaFunction = metaFunctionType;
