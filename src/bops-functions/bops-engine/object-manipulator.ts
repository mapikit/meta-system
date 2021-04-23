import { CloudedObject } from "@api/common/types/clouded-object";
import { BopsInput } from "@api/configuration-de-serializer/domain/business-operations-type";
import { inspect } from "util";

export class ObjectResolver {
  public static resolveTargets (source : unknown) : unknown {
    const res = {};
    for(const key of Object.keys(source)) {
      const targetLevels = key.split(".");
      let current = res;
      targetLevels.forEach((level, index) => {
        current[level] = (index == targetLevels.length-1) ? source[key] : current[level] || {};
        current = current[level];
      });
    }
    return res;
  }

  public static extractOutput (source : unknown, desiredOutput ?: string) : unknown {
    if(!desiredOutput) return source;
    const targetLevels = desiredOutput.split(".");
    let current = source;
    targetLevels.forEach(level => {
      if(!current[level]) throw new Error(`${level} was not found in ${inspect(source, false, null, true)}`);
      current = current[level];
    });
    return current;
  }

  public static validateConfiguredInputs (configuredInputs : BopsInput[], inputs : CloudedObject) : CloudedObject {
    const validatedInputs = {};
    configuredInputs.forEach(configuredInput => {
      if(inputs && typeof inputs[configuredInput.name] === configuredInput.type) {
        validatedInputs[configuredInput.name] = inputs[configuredInput.name];
      }
    });
    return validatedInputs;
  }
}
