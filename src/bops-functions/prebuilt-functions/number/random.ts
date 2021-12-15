import { InternalMetaFunction } from "../../internal-meta-function";
import MersenneTwister from "mersenne-twister";

export const randomNumberBopsFunction = () : unknown => {
  const random = new MersenneTwister();

  return ({ result: random.random() });
};

export const randomNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "randomNumber",
  version: "1.0.0",
  description: "Generates a Pseudo Random number ([0, 1]) using Mersenne-Twister Algorithm",
  output: {
    result: { type: "number", required: true },
  },
};
