import { CloudedObject } from "../../common/types/clouded-object";
// import { inspect } from "util";

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

  public static extractProperty (source : unknown, path ?: string[]) : unknown {
    if(!path) return source;
    let current = source;
    path.forEach(level => {
      // TODO: Later on we will make this type-safe by receiving the object definition
      // from which the property is being extracted

      // const isFound = current[level] !== undefined && current[level] !== null;
      // if(!isFound) throw new Error(`${level} was not found in ${inspect(source, false, null, true)}`);
      try {
        current = current[level];
      } catch {
        current = undefined;
      }
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
