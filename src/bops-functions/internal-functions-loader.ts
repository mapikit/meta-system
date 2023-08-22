/* eslint-disable max-len */
import { EntityBroker } from "../broker/entity-broker.js";
import { arrayAtBopsFunction, arrayAtBopsFunctionInformation } from "./prebuilt-functions/array/array-at.js";
import { arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation } from "./prebuilt-functions/array/find-index.js";
import { arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation } from "./prebuilt-functions/array/inlcudes.js";
import { arrayJoinBopsFunction, arrayJoinBopsFunctionInformation } from "./prebuilt-functions/array/join.js";
import { arrayLengthBopsFunction, arrayLengthBopsFunctionInformation } from "./prebuilt-functions/array/length.js";
import { arrayPushBopsFunction, arrayPushBopsFunctionInformation } from "./prebuilt-functions/array/push.js";
import { arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation } from "./prebuilt-functions/array/remove.js";
import { isNillBopsFunction, isNillBopsFunctionInformation } from "./prebuilt-functions/assertion/is-nill.js";
import { boolToNumberBopsFunction, boolToNumberBopsFunctionInformation } from "./prebuilt-functions/boolean/bool-to-number.js";
import { boolToStringBopsFunction, boolToStringBopsFunctionInformation } from "./prebuilt-functions/boolean/bool-to-string.js";
import { dateNowBopsFunction, dateNowBopsFunctionInformation } from "./prebuilt-functions/date/date-now.js";
import { forLoopFunction, forLoopInformation } from "./prebuilt-functions/flux-control/forLoop.js";
import { ifBopsFunction, ifBopsFunctionInformation } from "./prebuilt-functions/flux-control/if.js";
import { tryCatchBopsFunction, tryCatchBopsFunctionInformation } from "./prebuilt-functions/flux-control/try-catch.js";
import { andGateBopsFunction, andGateBopsFunctionInformation } from "./prebuilt-functions/logic/and.js";
import { isEqualToBopsFunction, isEqualToBopsFunctionInformation } from "./prebuilt-functions/logic/equal.js";
import { higherOrEqualToBopsFunction, higherOrEqualToBopsFunctionInformation } from "./prebuilt-functions/logic/higher-or-equal-to.js";
import { higherThanBopsFunction, higherThanBopsFunctionInformation } from "./prebuilt-functions/logic/higher-than.js";
import { lowerOrEqualToBopsFunction, lowerOrEqualToBopsFunctionInformation } from "./prebuilt-functions/logic/lower-or-equal-to.js";
import { lowerThanBopsFunction, lowerThanBopsFunctionInformation } from "./prebuilt-functions/logic/lower-than.js";
import { notBopsFunction, notBopsFunctionInformation } from "./prebuilt-functions/logic/not.js";
import { orGateBopsFunction, orGateBopsFunctionInformation } from "./prebuilt-functions/logic/or.js";
import { absoluteBopsFunction, absoluteFunctionInformation } from "./prebuilt-functions/math/absolute.js";
import { addBopsFunction, addFunctionInformation } from "./prebuilt-functions/math/add.js";
import { divideBopsFunction, divideFunctionInformation } from "./prebuilt-functions/math/divide.js";
import { exponentialBopsFunction, exponentialFunctionInformation } from "./prebuilt-functions/math/exponential.js";
import { modulusBopsFunction, modulusFunctionInformation } from "./prebuilt-functions/math/modulus.js";
import { multiplyBopsFunction, multiplyFunctionInformation } from "./prebuilt-functions/math/multipy.js";
import { roundBopsFunction, roundFunctionInformation } from "./prebuilt-functions/math/round.js";
import { squareRootBopsFunction, squareRootFunctionInformation } from "./prebuilt-functions/math/square-root.js";
import { subtractBopsFunction, subtractFunctionInformation } from "./prebuilt-functions/math/subtract.js";
import { randomNumberBopsFunction, randomNumberBopsFunctionInformation } from "./prebuilt-functions/number/random.js";
import { toExponentialBopsFunction, toExponentialBopsFunctionInformation } from "./prebuilt-functions/number/to-exponential.js";
import { numberToStringFunction, numberToStringFunctionInformation } from "./prebuilt-functions/number/to-string.js";
import { combineObjectBopsFunction, combineObjectBopsFunctionInformation } from "./prebuilt-functions/object/combine.js";
import { createObjectBopsFunction, createObjectBopsFunctionInformation } from "./prebuilt-functions/object/create.js";
import { getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation } from "./prebuilt-functions/object/get-value.js";
import { getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation } from "./prebuilt-functions/object/keys.js";
import { objectToStringBopsFunction, objectToStringBopsFunctionInformation } from "./prebuilt-functions/object/to-string.js";
import { getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation } from "./prebuilt-functions/object/values.js";
import { charAtBopsFunction, charAtBopsFunctionInformation } from "./prebuilt-functions/string/char-at.js";
import { countStringFunction, countStringFunctionInformation } from "./prebuilt-functions/string/count.js";
import { indexOfStringFunction, indexOfStringFunctionInformation } from "./prebuilt-functions/string/index-of.js";
import { stringReplaceFunction, stringReplaceFunctionInformation } from "./prebuilt-functions/string/replace.js";
import { stringToNumberBopsFunction, stringToNumberBopsFunctionInformation } from "./prebuilt-functions/string/to-number.js";
import { executeWithArgs, executeWithArgsFunctionInformation } from "./prebuilt-functions/system/execute-with-args.js";
import { getSystemFunction, getSystemFunctionFunctionInformation } from "./prebuilt-functions/system/get-system-function.js";

// eslint-disable-next-line max-lines-per-function
export const loadInternalFunctions = (functionsBroker : EntityBroker) : void => {
  // Math Functions
  functionsBroker.internalFunctions.setFunction(addBopsFunction, addFunctionInformation);
  functionsBroker.internalFunctions.setFunction(subtractBopsFunction, subtractFunctionInformation);
  functionsBroker.internalFunctions.setFunction(divideBopsFunction, divideFunctionInformation);
  functionsBroker.internalFunctions.setFunction(multiplyBopsFunction, multiplyFunctionInformation);
  functionsBroker.internalFunctions.setFunction(absoluteBopsFunction, absoluteFunctionInformation);
  functionsBroker.internalFunctions.setFunction(exponentialBopsFunction, exponentialFunctionInformation);
  functionsBroker.internalFunctions.setFunction(modulusBopsFunction, modulusFunctionInformation);
  functionsBroker.internalFunctions.setFunction(roundBopsFunction, roundFunctionInformation);
  functionsBroker.internalFunctions.setFunction(squareRootBopsFunction, squareRootFunctionInformation);

  // Assertion Functions
  functionsBroker.internalFunctions.setFunction(isNillBopsFunction, isNillBopsFunctionInformation);

  // Boolean Functions
  functionsBroker.internalFunctions.setFunction(boolToNumberBopsFunction, boolToNumberBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(boolToStringBopsFunction, boolToStringBopsFunctionInformation);

  // Number Functions
  functionsBroker.internalFunctions.setFunction(randomNumberBopsFunction, randomNumberBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(toExponentialBopsFunction, toExponentialBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(numberToStringFunction, numberToStringFunctionInformation);

  // String Functions
  functionsBroker.internalFunctions.setFunction(charAtBopsFunction, charAtBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(countStringFunction, countStringFunctionInformation);
  functionsBroker.internalFunctions.setFunction(indexOfStringFunction, indexOfStringFunctionInformation);
  functionsBroker.internalFunctions.setFunction(stringReplaceFunction, stringReplaceFunctionInformation);
  functionsBroker.internalFunctions.setFunction(stringToNumberBopsFunction, stringToNumberBopsFunctionInformation);

  // Object Functions
  functionsBroker.internalFunctions.setFunction(combineObjectBopsFunction, combineObjectBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(createObjectBopsFunction, createObjectBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(objectToStringBopsFunction, objectToStringBopsFunctionInformation);

  // Array Functions
  functionsBroker.internalFunctions.setFunction(arrayJoinBopsFunction, arrayJoinBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayAtBopsFunction, arrayAtBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayLengthBopsFunction, arrayLengthBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayPushBopsFunction, arrayPushBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation);

  // Logic Functions
  functionsBroker.internalFunctions.setFunction(andGateBopsFunction, andGateBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(isEqualToBopsFunction, isEqualToBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(higherThanBopsFunction, higherThanBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(higherOrEqualToBopsFunction, higherOrEqualToBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(lowerOrEqualToBopsFunction, lowerOrEqualToBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(lowerThanBopsFunction, lowerThanBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(notBopsFunction, notBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(orGateBopsFunction, orGateBopsFunctionInformation);

  // Flux-Control Functions
  functionsBroker.internalFunctions.setFunction(ifBopsFunction, ifBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(tryCatchBopsFunction, tryCatchBopsFunctionInformation);
  functionsBroker.internalFunctions.setFunction(forLoopFunction, forLoopInformation);

  // Date Functions
  functionsBroker.internalFunctions.setFunction(dateNowBopsFunction, dateNowBopsFunctionInformation);

  // System Functions
  functionsBroker.internalFunctions.setFunction(getSystemFunction, getSystemFunctionFunctionInformation);
  functionsBroker.internalFunctions.setFunction(executeWithArgs, executeWithArgsFunctionInformation);
};
