import { CloudedObject } from "../../common/types/clouded-object.js";
// import { inspect } from "util";

export class ObjectResolver {
  // eslint-disable-next-line max-lines-per-function
  public static flattenObject (source : Array<object>, partial = {}) : CloudedObject {
    const result = partial;
    for(let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
      if(source[sourceIndex] === undefined) continue;
      const key = Object.keys(source[sourceIndex])[0];
      const targetLevels = key.split(".");
      let current = result;
      targetLevels.every((level, index) => {
        if(level.endsWith("]")) {
          this.solveArray(targetLevels.slice(index).join("."), source[sourceIndex][key], current);
          return false;
        }
        else {
          current[level] = (index === targetLevels.length-1) ? source[sourceIndex][key] : current[level] || {};
          current = current[level];
        }
        return true;
      });
    }
    return result;
  }

  //TODO Maybe look into even better ways of improving the efficiency of this method
  private static solveArray (level : string, sourceItem : object, targetObject : object) : void {
    let value = sourceItem;
    const openBracket = level.indexOf("[");
    const key = level.slice(0, openBracket);
    const closeBracket = level.indexOf("]");
    const index = level.slice(openBracket+1, closeBracket);

    if(targetObject[key] === undefined) targetObject[key] = [];
    if(level.length-1 > closeBracket) value = this.flattenObject([{ [level.slice(closeBracket+2)]: value }]);
    if(index === "") targetObject[key].push(value);
    else {
      value = typeof value === "object" ? Object.assign(targetObject[key][index] ?? {}, value) : value;
      targetObject[key][index] = value;
    }
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
