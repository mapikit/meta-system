/* eslint-disable max-len */
import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";
import { arrayAtBopsFunction, arrayAtBopsFunctionInformation } from "../prebuilt-functions/array/array-at.js";
import { arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation } from "../prebuilt-functions/array/find-index.js";
import { arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation } from "../prebuilt-functions/array/inlcudes.js";
import { arrayJoinBopsFunction, arrayJoinBopsFunctionInformation } from "../prebuilt-functions/array/join.js";
import { arrayLengthBopsFunction, arrayLengthBopsFunctionInformation } from "../prebuilt-functions/array/length.js";
import { arrayPushBopsFunction, arrayPushBopsFunctionInformation } from "../prebuilt-functions/array/push.js";
import { arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation } from "../prebuilt-functions/array/remove.js";
import { isNillBopsFunction, isNillBopsFunctionInformation } from "../prebuilt-functions/assertion/is-nill.js";
import { boolToNumberBopsFunction, boolToNumberBopsFunctionInformation } from "../prebuilt-functions/boolean/bool-to-number.js";
import { boolToStringBopsFunction, boolToStringBopsFunctionInformation } from "../prebuilt-functions/boolean/bool-to-string.js";
import { dateNowBopsFunction, dateNowBopsFunctionInformation } from "../prebuilt-functions/date/date-now.js";
import { forLoopFunction, forLoopInformation } from "../prebuilt-functions/flux-control/forLoop.js";
import { ifBopsFunction, ifBopsFunctionInformation } from "../prebuilt-functions/flux-control/if.js";
import { tryCatchBopsFunction, tryCatchBopsFunctionInformation } from "../prebuilt-functions/flux-control/try-catch.js";
import { andGateBopsFunction, andGateBopsFunctionInformation } from "../prebuilt-functions/logic/and.js";
import { isEqualToBopsFunction, isEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/equal.js";
import { higherOrEqualToBopsFunction, higherOrEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/higher-or-equal-to.js";
import { higherThanBopsFunction, higherThanBopsFunctionInformation } from "../prebuilt-functions/logic/higher-than.js";
import { lowerOrEqualToBopsFunction, lowerOrEqualToBopsFunctionInformation } from "../prebuilt-functions/logic/lower-or-equal-to.js";
import { lowerThanBopsFunction, lowerThanBopsFunctionInformation } from "../prebuilt-functions/logic/lower-than.js";
import { notBopsFunction, notBopsFunctionInformation } from "../prebuilt-functions/logic/not.js";
import { orGateBopsFunction, orGateBopsFunctionInformation } from "../prebuilt-functions/logic/or.js";
import { absoluteBopsFunction, absoluteFunctionInformation } from "../prebuilt-functions/math/absolute.js";
import { addBopsFunction, addFunctionInformation } from "../prebuilt-functions/math/add.js";
import { divideBopsFunction, divideFunctionInformation } from "../prebuilt-functions/math/divide.js";
import { exponentialBopsFunction, exponentialFunctionInformation } from "../prebuilt-functions/math/exponential.js";
import { modulusBopsFunction, modulusFunctionInformation } from "../prebuilt-functions/math/modulus.js";
import { multiplyBopsFunction, multiplyFunctionInformation } from "../prebuilt-functions/math/multipy.js";
import { roundBopsFunction, roundFunctionInformation } from "../prebuilt-functions/math/round.js";
import { squareRootBopsFunction, squareRootFunctionInformation } from "../prebuilt-functions/math/square-root.js";
import { subtractBopsFunction, subtractFunctionInformation } from "../prebuilt-functions/math/subtract.js";
import { randomNumberBopsFunction, randomNumberBopsFunctionInformation } from "../prebuilt-functions/number/random.js";
import { toExponentialBopsFunction, toExponentialBopsFunctionInformation } from "../prebuilt-functions/number/to-exponential.js";
import { numberToStringFunction, numberToStringFunctionInformation } from "../prebuilt-functions/number/to-string.js";
import { combineObjectBopsFunction, combineObjectBopsFunctionInformation } from "../prebuilt-functions/object/combine.js";
import { createObjectBopsFunction, createObjectBopsFunctionInformation } from "../prebuilt-functions/object/create.js";
import { getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation } from "../prebuilt-functions/object/get-value.js";
import { getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation } from "../prebuilt-functions/object/keys.js";
import { objectToStringBopsFunction, objectToStringBopsFunctionInformation } from "../prebuilt-functions/object/to-string.js";
import { getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation } from "../prebuilt-functions/object/values.js";
import { charAtBopsFunction, charAtBopsFunctionInformation } from "../prebuilt-functions/string/char-at.js";
import { countStringFunction, countStringFunctionInformation } from "../prebuilt-functions/string/count.js";
import { indexOfStringFunction, indexOfStringFunctionInformation } from "../prebuilt-functions/string/index-of.js";
import { stringReplaceFunction, stringReplaceFunctionInformation } from "../prebuilt-functions/string/replace.js";
import { stringToNumberBopsFunction, stringToNumberBopsFunctionInformation } from "../prebuilt-functions/string/to-number.js";
import { FunctionManager } from "./function-manager.js";
import { executeWithArgs, executeWithArgsFunctionInformation } from "../prebuilt-functions/system/execute-with-args.js";
import { getSystemFunction, getSystemFunctionFunctionInformation } from "../prebuilt-functions/system/get-system-function.js";


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
