import { BopsOutput } from "@api/configuration-de-serializer/domain/business-operations-type";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";
import { objectHasKeys } from "@api/configuration-de-serializer/domain/assertions/object-has-keys";

// eslint-disable-next-line max-lines-per-function
export function isBopsOutput (input : unknown) : asserts input is BopsOutput[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: outputs should be an Array");
  }

  const requiredKeys : Array<keyof BopsOutput> = [
    "statusCode",
    "name",
    "type",
  ];

  input.forEach((entry) => {
    isType<object>("object", "Business Operation With Incorrect Type Found", entry);

    objectHasKeys(entry, requiredKeys, "Business Operation Input");

    const bopsOutputEntry = entry as BopsOutput;

    isType<string>("string", "Business Operation With Incorrect Type Found", bopsOutputEntry.name);
    isType<number>("number", "Business Operation With Incorrect Type Found", bopsOutputEntry.statusCode);
  });
};
