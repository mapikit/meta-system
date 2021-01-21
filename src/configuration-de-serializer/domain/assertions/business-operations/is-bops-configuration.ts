import { BopsConfigurationEntry, InputsSource, NextFunctions } from
  "@api/configuration-de-serializer/domain/business-operations";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";

function isInputsSource (input : unknown) : asserts input is InputsSource {
  const inputAssertion = input as InputsSource;

  isType("string", "source must be a string", inputAssertion.source);
  isType("string", "target must be a string", inputAssertion.target);
}

function isNextFunctions (input : unknown) : asserts input is NextFunctions {
  const inputAssertion = input as NextFunctions;

  isType("number", "nextKey must be a number", inputAssertion.nextKey);

  if (inputAssertion.branch !== undefined) {
    isType("string", "If branch is present must be a string", inputAssertion.branch);
  }
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
    isNextFunctions(config.nextFunctions);
  });
}
