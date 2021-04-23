import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import MersenneTwister from "mersenne-twister";

export const randomNumberBopsFunction = () : unknown => {
  const random = new MersenneTwister();

  return ({ result: random.random() });
};

export const randomNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "randomNumberBopsFunction",
  version: "1.0.0",
  description: "Generates a Pseudo Random number ([0, 1]) using Mersenne-Twister Algorithm",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "default",
    },
  ],
  outputBranches: [
    {
      branchName: "default",
    },
  ],
  inputParameters: [],
  customTypes: [],
};
