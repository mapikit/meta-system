import { SchemasType } from "@api/configuration/schemas/schemas-type";

// eslint-disable-next-line max-lines-per-function
export function isSchemaRoutesConfiguration (input : unknown) : asserts input is SchemasType["routes"] {
  if (typeof input !== "object") {
    throw this.defaultError;
  }

  const routesRequiredKeys : Array<keyof SchemasType["routes"]> = [
    "getMethodEnabled",
    "postMethodEnabled",
    "deleteMethodEnabled",
    "patchMethodEnabled",
    "putMethodEnabled",
    "queryParamsGetEnabled",
  ];

  const inputKeys = Object.keys(input);
  const hasAllRequiredKeys = routesRequiredKeys.some((requiredKey) =>
    inputKeys.includes(requiredKey),
  );

  if (!hasAllRequiredKeys) {
    throw this.defaultError;
  }

  const allValuesAreBoolean = Object.values(input).every((value) => typeof value === "boolean");

  if (!allValuesAreBoolean) {
    throw this.defaultError;
  }
};
