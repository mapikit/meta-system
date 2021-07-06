import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";
import MersenneTwister from "mersenne-twister";

export const randomNumberBopsFunction = () : unknown => {
  const random = new MersenneTwister();

  return ({ result: random.random() });
};

export const randomNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "randomNumberBopsFunction",
  version: "1.0.0",
  description: "Generates a Pseudo Random number ([0, 1]) using Mersenne-Twister Algorithm",
  outputData: {
    result: { type: "number", required: true },
  },
};
