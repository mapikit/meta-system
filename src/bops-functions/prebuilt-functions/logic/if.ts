import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const ifBopsFunction = (input : { conditional : boolean }) : unknown => {
  const conditionResultTrue = !!input.conditional;

  const conditionResultFalse = !conditionResultTrue;

  if (conditionResultTrue) return ({ conditionResultTrue });

  return ({ conditionResultFalse });
};

export const ifBopsFunctionInformation : InternalMetaFunction = {
  functionName: "ifBopsFunction",
  version: "1.0.0",
  description: "Evaluates a boolean, branching out the result",
  outputData: [
    {
      type: "boolean",
      name: "conditionResultTrue",
      branch: "conditionResultTrue",
    },
    {
      type: "boolean",
      name: "conditionResultFalse",
      branch: "conditionResultFalse",
    },
  ],
  outputBranches: [
    {
      branchName: "conditionResultTrue",
    },
    {
      branchName: "conditionResultFalse",
    },
  ],
  inputParameters: [
    { name: "conditional", type: "boolean", required: true },
  ],
  customTypes: [],
};
