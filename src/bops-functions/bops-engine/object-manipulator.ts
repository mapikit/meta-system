import { CloudedObject } from "@api/common/types/clouded-object";
import { inspect } from "util";

export class ObjectResolver {
  public static flattenObject (source : unknown) : CloudedObject {
    const result = {};
    for(const key of Object.keys(source)) {
      const targetLevels = key.split(".");
      let current = result;
      targetLevels.forEach((level, index) => {
        current[level] = (index === targetLevels.length-1) ? source[key] : current[level] || {};
        current = current[level];
      });
    }
    return result;
  }

  public static extractProperty (source : unknown, outputPath ?: string) : unknown {
    if(!outputPath) return source;
    const targetLevels = outputPath.split(".");
    let current = source;
    targetLevels.forEach(level => {
      if(!current[level]) throw new Error(`${level} was not found in ${inspect(source, false, null, true)}`);
      current = current[level];
    });
    return current;
  }

  // public static validateConfiguredInputs (configuredInputs : BopsInput[], inputs : CloudedObject) : CloudedObject {
  //   const validatedInputs = {};
  //   configuredInputs.forEach(configuredInput => {
  //     if(inputs && typeof inputs[configuredInput.name] === configuredInput.type) {
  //       validatedInputs[configuredInput.name] = inputs[configuredInput.name];
  //     }
  //   });
  //   return validatedInputs;
  // }
}
