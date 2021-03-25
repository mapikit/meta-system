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
  valueToReplaceStringArray
} from "@api/schemas/application/query-builder/query-translation-type";

export const queryValueReplace = <T>(mongoQuery : QuerySelector<T>, replacer : unknown) :
QuerySelector<T> => {
  const result = Object.assign({}, mongoQuery);

  Object.keys(result).forEach((key) => {
    if (isReplaceableValue(result[key])) {
      result[key] = replacer;
      return;
    }

    result[key] = queryValueReplace(result[key], replacer);
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
