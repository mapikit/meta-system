/* eslint-disable max-len */
import { InternalMetaFunction } from "bops-functions/internal-meta-function";
import { arrayAtBopsFunction, arrayAtBopsFunctionInformation } from "../prebuilt-functions/array/array-at";
import { arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation } from "../prebuilt-functions/array/find-index";
import { arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation } from "../prebuilt-functions/array/inlcudes";
import { arrayJoinBopsFunction, arrayJoinBopsFunctionInformation } from "../prebuilt-functions/array/join";
import { arrayLengthBopsFunction, arrayLengthBopsFunctionInformation } from "../prebuilt-functions/array/length";
import { arrayPushBopsFunction, arrayPushBopsFunctionInformation } from "../prebuilt-functions/array/push";
import { arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation } from "../prebuilt-functions/array/remove";
import { isNillBopsFunction, isNillBopsFunctionInformation } from "../prebuilt-functions/assertion/is-nill";
import { boolToNumberBopsFunction, boolToNumberBopsFunctionInformation } from "../prebuilt-functions/boolean/bool-to-number";
import { boolToStringBopsFunction, boolToStringBopsFunctionInformation } from "../prebuilt-functions/boolean/bool-to-string";
import { dateNowBopsFunction, dateNowBopsFunctionInformation } from "../prebuilt-functions/date/date-now";
import { forLoopFunction, forLoopInformation } from "../prebuilt-functions/flux-control/forLoop";
import { ifBopsFunction, ifBopsFunctionInformation } from "../prebuilt-functions/flux-control/if";
import { tryCatchBopsFunction, tryCatchBopsFunctionInformation } from "../prebuilt-functions/flux-control/try-catch";
import { andGateBopsFunction, andGateBopsFunctionInformation } from "../prebuilt-functions/logic/and";
import { isEqualToBopsFunction, isEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/equal";
import { higherOrEqualToBopsFunction, higherOrEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/higher-or-equal-to";
import { higherThanBopsFunction, higherThanBopsFunctionInformation } from "../prebuilt-functions/logic/higher-than";
import { lowerOrEqualToBopsFunction, lowerOrEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/lower-or-equal-to";
import { lowerThanBopsFunction, lowerThanBopsFunctionInformation } from "../prebuilt-functions/logic/lower-than";
import { notBopsFunction, notBopsFunctionInformation } from "../prebuilt-functions/logic/not";
import { orGateBopsFunction, orGateBopsFunctionInformation } from "../prebuilt-functions/logic/or";
import { absoluteBopsFunction, absoluteFunctionInformation } from "../prebuilt-functions/math/absolute";
import { addBopsFunction, addFunctionInformation } from "../prebuilt-functions/math/add";
import { divideBopsFunction, divideFunctionInformation } from "../prebuilt-functions/math/divide";
import { exponentialBopsFunction, exponentialFunctionInformation } from "../prebuilt-functions/math/exponential";
import { modulusBopsFunction, modulusFunctionInformation } from "../prebuilt-functions/math/modulus";
import { multiplyBopsFunction, multiplyFunctionInformation } from "../prebuilt-functions/math/multipy";
import { roundBopsFunction, roundFunctionInformation } from "../prebuilt-functions/math/round";
import { squareRootBopsFunction, squareRootFunctionInformation } from "../prebuilt-functions/math/square-root";
import { subtractBopsFunction, subtractFunctionInformation } from "../prebuilt-functions/math/subtract";
import { randomNumberBopsFunction, randomNumberBopsFunctionInformation } from "../prebuilt-functions/number/random";
import { toExponentialBopsFunction, toExponentialBopsFunctionInformation } from "../prebuilt-functions/number/to-exponential";
import { numberToStringFunction, numberToStringFunctionInformation } from "../prebuilt-functions/number/to-string";
import { combineObjectBopsFunction, combineObjectBopsFunctionInformation } from "../prebuilt-functions/object/combine";
import { createObjectBopsFunction, createObjectBopsFunctionInformation } from "../prebuilt-functions/object/create";
import { getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation } from "../prebuilt-functions/object/get-value";
import { getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation } from "../prebuilt-functions/object/keys";
import { objectToStringBopsFunction, objectToStringBopsFunctionInformation } from "../prebuilt-functions/object/to-string";
import { getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation } from "../prebuilt-functions/object/values";
import { charAtBopsFunction, charAtBopsFunctionInformation } from "../prebuilt-functions/string/char-at";
import { countStringFunction, countStringFunctionInformation } from "../prebuilt-functions/string/count";
import { indexOfStringFunction, indexOfStringFunctionInformation } from "../prebuilt-functions/string/index-of";
import { stringReplaceFunction, stringReplaceFunctionInformation } from "../prebuilt-functions/string/replace";
import { stringToNumberBopsFunction, stringToNumberBopsFunctionInformation } from "../prebuilt-functions/string/to-number";
import { FunctionManager } from "./function-manager";
import { executeWithArgs, executeWithArgsFunctionInformation } from "../prebuilt-functions/system/execute-with-args";
import { getSystemFunction, getSystemFunctionFunctionInformation } from "../prebuilt-functions/system/get-system-function";


export class InternalFunctionManagerClass implements FunctionManager {
  private functionMap = new Map<string, Function>()
  public infoMap = new Map<string, InternalMetaFunction>()

  public get (functionName : string) : Function {
    return this.functionMap.get(functionName);
  }

  public add (declaration : Function, functionInfo : InternalMetaFunction) : void {
    this.infoMap.set(functionInfo.functionName, functionInfo);
    this.functionMap.set(functionInfo.functionName, declaration);
  }

  public functionIsInstalled (functionName : string) : boolean {
    return this.get(functionName) !== undefined;
  }

  public replace (functionName : string, declaration : Function) : void {
    const currentInfo = this.infoMap.get(functionName);
    this.functionMap.delete(functionName);
    this.add(declaration, currentInfo);
  }
}

const internalFunctionManager = new InternalFunctionManagerClass();

// Math Functions
internalFunctionManager.add(addBopsFunction, addFunctionInformation);
internalFunctionManager.add(subtractBopsFunction, subtractFunctionInformation);
internalFunctionManager.add(divideBopsFunction, divideFunctionInformation);
internalFunctionManager.add(multiplyBopsFunction, multiplyFunctionInformation);
internalFunctionManager.add(absoluteBopsFunction, absoluteFunctionInformation);
internalFunctionManager.add(exponentialBopsFunction, exponentialFunctionInformation);
internalFunctionManager.add(modulusBopsFunction, modulusFunctionInformation);
internalFunctionManager.add(roundBopsFunction, roundFunctionInformation);
internalFunctionManager.add(squareRootBopsFunction, squareRootFunctionInformation);

// Assertion Functions
internalFunctionManager.add(isNillBopsFunction, isNillBopsFunctionInformation);

// Boolean Functions
internalFunctionManager.add(boolToNumberBopsFunction, boolToNumberBopsFunctionInformation);
internalFunctionManager.add(boolToStringBopsFunction, boolToStringBopsFunctionInformation);

// Number Functions
internalFunctionManager.add(randomNumberBopsFunction, randomNumberBopsFunctionInformation);
internalFunctionManager.add(toExponentialBopsFunction, toExponentialBopsFunctionInformation);
internalFunctionManager.add(numberToStringFunction, numberToStringFunctionInformation);

// String Functions
internalFunctionManager.add(charAtBopsFunction, charAtBopsFunctionInformation);
internalFunctionManager.add(countStringFunction, countStringFunctionInformation);
internalFunctionManager.add(indexOfStringFunction, indexOfStringFunctionInformation);
internalFunctionManager.add(stringReplaceFunction, stringReplaceFunctionInformation);
internalFunctionManager.add(stringToNumberBopsFunction, stringToNumberBopsFunctionInformation);

// Object Functions
internalFunctionManager.add(combineObjectBopsFunction, combineObjectBopsFunctionInformation);
internalFunctionManager.add(createObjectBopsFunction, createObjectBopsFunctionInformation);
internalFunctionManager.add(getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation);
internalFunctionManager.add(getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation);
internalFunctionManager.add(getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation);
internalFunctionManager.add(objectToStringBopsFunction, objectToStringBopsFunctionInformation);

// Array Functions
internalFunctionManager.add(arrayJoinBopsFunction, arrayJoinBopsFunctionInformation);
internalFunctionManager.add(arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation);
internalFunctionManager.add(arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation);
internalFunctionManager.add(arrayAtBopsFunction, arrayAtBopsFunctionInformation);
internalFunctionManager.add(arrayLengthBopsFunction, arrayLengthBopsFunctionInformation);
internalFunctionManager.add(arrayPushBopsFunction, arrayPushBopsFunctionInformation);
internalFunctionManager.add(arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation);

// Logic Functions
internalFunctionManager.add(andGateBopsFunction, andGateBopsFunctionInformation);
internalFunctionManager.add(isEqualToBopsFunction, isEqualToBopsFunctionInformation);
internalFunctionManager.add(higherThanBopsFunction, higherThanBopsFunctionInformation);
internalFunctionManager.add(higherOrEqualToBopsFunction, higherOrEqualToBopsFunctionInformation);
internalFunctionManager.add(lowerOrEqualToBopsFunction, lowerOrEqualToBopsFunctionInformation);
internalFunctionManager.add(lowerThanBopsFunction, lowerThanBopsFunctionInformation);
internalFunctionManager.add(notBopsFunction, notBopsFunctionInformation);
internalFunctionManager.add(orGateBopsFunction, orGateBopsFunctionInformation);

// Flux-Control Functions
internalFunctionManager.add(ifBopsFunction, ifBopsFunctionInformation);
internalFunctionManager.add(tryCatchBopsFunction, tryCatchBopsFunctionInformation);
internalFunctionManager.add(forLoopFunction, forLoopInformation);

// Date Functions
internalFunctionManager.add(dateNowBopsFunction, dateNowBopsFunctionInformation);

// System Functions
internalFunctionManager.add(getSystemFunction, getSystemFunctionFunctionInformation);
internalFunctionManager.add(executeWithArgs, executeWithArgsFunctionInformation);

export default internalFunctionManager;
