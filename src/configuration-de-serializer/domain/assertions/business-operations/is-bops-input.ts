import { BopsInput } from "@api/configuration-de-serializer/domain/business-operations";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";
import { objectHasKeys } from "@api/configuration-de-serializer/domain/assertions/object-has-keys";
import { stringIsOneOf } from "@api/configuration-de-serializer/domain/assertions/string-is-one-of";

// eslint-disable-next-line max-lines-per-function
export function isBopsInput (input : unknown) : asserts input is BopsInput[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: inputs should be an Array");
  }

  const requiredKeys : Array<keyof BopsInput> = [
    "localization",
    "name",
    "type",
  ];

  input.forEach((entry) => {
    isType<object>("object", "Business Operation With Incorrect Type Found", entry);

    objectHasKeys(entry, requiredKeys, "Business Operation Input");

    const bopsInputEntry = entry as BopsInput;

    stringIsOneOf<BopsInput["type"]>(bopsInputEntry.type, ["uri", "body"]);
    isType("string", "Business Operation With Incorrect Type Found", bopsInputEntry.name);
    isType("string", "Business Operation With Incorrect Type Found", bopsInputEntry.localization);
  });
};
