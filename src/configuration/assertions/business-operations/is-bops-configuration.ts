import { Dependency, BopsConfigurationEntry } from "../../business-operations/business-operations-type.js";
import { isType } from "../is-type.js";


function isDependencies (input : unknown) : asserts input is Dependency[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Configuration with wrong type found: \"dependencies\" should be an Array");
  }

  const inputAssertion = input as Dependency[];

  inputAssertion.forEach((sourceInput) => {
    if (!["number", "string"].includes(typeof sourceInput.origin)) {
      throw Error("\"origin\" must be a string or a number");
    }

    if (sourceInput.targetPath !== undefined || sourceInput.originPath !== undefined) {
      isType("string", "targetPath must be a string", sourceInput.targetPath);

      isType("string", "originPath must be a string", sourceInput.originPath);
    }
  });
}

// eslint-disable-next-line max-lines-per-function
export function isBopsConfigurationEntry (input : unknown, parent : string)
  : asserts input is BopsConfigurationEntry[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Configuration with wrong type found: configuration should be an Array");
  }

  const configurations = input as BopsConfigurationEntry[];

  configurations.forEach((config) => {
    isType("string", "\"moduleName\" must be a string", config.moduleName);

    const moduleTypes = ["schemaFunction", "external", "internal", "bop", "output", "variable", "protocol"];
    if (!moduleTypes.includes(config.moduleType)) {
      const header = `(${config.key}@${parent}})`;
      throw Error(`${header}\"moduleType\" must be one of the following: " + ${moduleTypes.join(", ")}`);
    }

    validateModulePackage(config);

    isType("number", "\"key\" must be a string", config.key);
    isDependencies(config.dependencies);
  });
}

const validateModulePackage = (config : BopsConfigurationEntry) : void => {
  if ("schemaFunction" === config.moduleType) {
    isType("string", "\"moduleType\" must be a string", config.moduleType);
  }

  if ("external" === config.moduleType && typeof config.modulePackage !== "undefined") {
    isType("string", "\"moduleType\" must be a string", config.moduleType);
  }
};
