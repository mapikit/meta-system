import { BopsConfigurationEntry, InputsSource, NextFunctions } from
  "@api/configuration-de-serializer/domain/business-operations-type";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";

function isInputsSource (input : unknown) : asserts input is InputsSource {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Configuration with wrong type found: \"inputsSource\" should be an Array");
  }

  const inputAssertion = input as InputsSource[];

  inputAssertion.forEach((sourceInput) => {
    if (!["number", "string"].includes(typeof sourceInput.source)) {
      throw Error("\"source\" must be a string: Not a string");
    }
    isType("string", "target must be a string", sourceInput.target);
  });
}

function isNextFunctions (input : unknown) : asserts input is NextFunctions {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Configuration with wrong type found: \"nextFunctions\" should be an Array");
  }

  const inputAssertion = input as NextFunctions[];

  inputAssertion.forEach((nextFunction) => {
    isType("number", "nextKey must be a number", nextFunction.nextKey);

    if (nextFunction.branch !== undefined) {
      isType("string", "If branch is present must be a string", nextFunction.branch);
    }
  });
}

export function isBopsConfigurationEntry (input : unknown) : asserts input is BopsConfigurationEntry[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Configuration with wrong type found: configuration should be an Array");
  }

  const configurations = input as BopsConfigurationEntry[];

  configurations.forEach((config) => {
    isType("string", "\"moduleRepo\" must be a string", config.moduleRepo);
    isType("number", "\"key\" must be a string", config.key);
    isInputsSource(config.inputsSource);

    // Not the last module of the chain
    if (config.moduleRepo.charAt(0) !== "%") {
      isNextFunctions(config.nextFunctions);
    }
  });
}