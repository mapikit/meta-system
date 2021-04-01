import { QuerySelector } from "mongodb";
import { valueToReplaceBoolean,
  valueToReplaceBooleanArray,
  valueToReplaceDate,
  valueToReplaceDateArray,
  valueToReplaceNumber,
  valueToReplaceNumberArray,
  valueToReplaceObject,
  valueToReplaceObjectArray,
  valueToReplaceString,
  valueToReplaceStringArray,
} from "@api/schemas/application/query-builder/query-translation-type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-lines-per-function
export const queryValueReplace = <T>(query : QuerySelector<T>, replacer : any) :
object => {
  const result = Array.isArray(query) ? [...query] : Object.assign({}, query);

  Object.keys(result).forEach((key) => {
    if (result[key] === valueToReplaceObjectArray) {
      result[key] = replaceObjectArray(replacer);
      return;
    }

    if (isReplaceableValue(result[key])) {
      result[key] = replacer;
      return;
    }

    result[key] = queryValueReplace(result[key], replacer);
  });

  return result;
};

const replaceObjectArray = (input : unknown[]) : unknown[] => {
  const result = [];

  input.forEach((element) => {
    result.push({ "$elemMatch": element });
  });

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReplaceableValue = (input : any) : boolean => {
  const replaceableValues = [
    valueToReplaceString,
    valueToReplaceStringArray,
    valueToReplaceBoolean,
    valueToReplaceNumber,
    valueToReplaceNumberArray,
    valueToReplaceDate,
    valueToReplaceDateArray,
    valueToReplaceBooleanArray,
    valueToReplaceObject,
    valueToReplaceObjectArray,
  ];

  return replaceableValues.includes(input);
};
