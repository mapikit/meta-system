import { CloudedObject } from "@api/common/types/clouded-object";
import { OutputData } from "meta-function-helper";

/**
 * Infers the output branch by the type provided on the Meta-Function.json file.
 * @returns `null` if the output type cannot be inffered.
 */
export const pickBranchOutput = (outputData : OutputData[], result : CloudedObject)
: string | null => {
  const branchesNamesOutputMap = getBranchesNamesOutputs(outputData);

  const resultKeys = Object.keys(result);

  for (const key of resultKeys) {
    const chosenBranch = branchesNamesOutputMap.get(key);

    if (chosenBranch !== undefined) {
      return chosenBranch;
    }
  }

  return null;
};

const getBranchesNamesOutputs = (outputData : OutputData[]) : Map<string, string> => {
  const branchesNamesOutputMap : Map<string, string> = new Map();

  outputData.forEach((outputInfo) => {
    if (outputInfo.branch === undefined) {
      return;
    }

    branchesNamesOutputMap.set(outputInfo.name, outputInfo.branch);
  });

  return branchesNamesOutputMap;
};
