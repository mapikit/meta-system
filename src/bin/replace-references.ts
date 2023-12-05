import { Configuration } from "../configuration/configuration.js";
import { PathUtils } from "../configuration/path-alias-utils.js";

const referenceableProperties : Array<keyof Configuration> = [
  "schemas",
  "businessOperations",
  "addons",
];


export async function replaceReferences (input : unknown) : Promise<void> {
  for(const property of referenceableProperties) {
    if(typeof input[property] === "string") {
      input[property] = await PathUtils.getContents(input[property]);
    }
  }
}
