import { getSystemFunction } from "../prebuilt-functions/system/get-system-function";
import { arrayAtBopsFunction } from "../prebuilt-functions/array/array-at";
import { arrayFindIndexBopsFunction } from "../prebuilt-functions/array/find-index";
import { arrayIncludesBopsFunction } from "../prebuilt-functions/array/inlcudes";
import { arrayJoinBopsFunction } from "../prebuilt-functions/array/join";
import { arrayLengthBopsFunction } from "../prebuilt-functions/array/length";
import { arrayPushBopsFunction } from "../prebuilt-functions/array/push";
import { arrayRemoveBopsFunction } from "../prebuilt-functions/array/remove";
import { isNillBopsFunction } from "../prebuilt-functions/assertion/is-nill";
import { boolToNumberBopsFunction } from "../prebuilt-functions/boolean/bool-to-number";
import { boolToStringBopsFunction } from "../prebuilt-functions/boolean/bool-to-string";
import { dateNowBopsFunction } from "../prebuilt-functions/date/date-now";
import { forLoopFunction } from "../prebuilt-functions/flux-control/forLoop";
import { ifBopsFunction } from "../prebuilt-functions/flux-control/if";
import { tryCatchBopsFunction } from "../prebuilt-functions/flux-control/try-catch";
import { andGateBopsFunction } from "../prebuilt-functions/logic/and";
import { isEqualToBopsFunction } from "../prebuilt-functions/logic/equal";
import { higherOrEqualToBopsFunction } from "../prebuilt-functions/logic/higher-or-equal-to";
import { higherThanBopsFunction } from "../prebuilt-functions/logic/higher-than";
import { lowerOrEqualToBopsFunction } from "../prebuilt-functions/logic/lower-or-equal-to";
import { lowerThanBopsFunction } from "../prebuilt-functions/logic/lower-than";
import { notBopsFunction } from "../prebuilt-functions/logic/not";
import { orGateBopsFunction } from "../prebuilt-functions/logic/or";
import { absoluteBopsFunction } from "../prebuilt-functions/math/absolute";
import { addBopsFunction } from "../prebuilt-functions/math/add";
import { divideBopsFunction } from "../prebuilt-functions/math/divide";
import { exponentialBopsFunction } from "../prebuilt-functions/math/exponential";
import { modulusBopsFunction } from "../prebuilt-functions/math/modulus";
import { multiplyBopsFunction } from "../prebuilt-functions/math/multipy";
import { roundBopsFunction } from "../prebuilt-functions/math/round";
import { squareRootBopsFunction } from "../prebuilt-functions/math/square-root";
import { subtractBopsFunction } from "../prebuilt-functions/math/subtract";
import { randomNumberBopsFunction } from "../prebuilt-functions/number/random";
import { toExponentialBopsFunction } from "../prebuilt-functions/number/to-exponential";
import { numberToStringFunction } from "../prebuilt-functions/number/to-string";
import { combineObjectBopsFunction } from "../prebuilt-functions/object/combine";
import { createObjectBopsFunction } from "../prebuilt-functions/object/create";
import { getObjectPropertyValueBopsFunction } from "../prebuilt-functions/object/get-value";
import { getObjectKeysBopsFunction } from "../prebuilt-functions/object/keys";
import { objectToStringBopsFunction } from "../prebuilt-functions/object/to-string";
import { getObjectValuesBopsFunction } from "../prebuilt-functions/object/values";
import { charAtBopsFunction } from "../prebuilt-functions/string/char-at";
import { countStringFunction } from "../prebuilt-functions/string/count";
import { indexOfStringFunction } from "../prebuilt-functions/string/index-of";
import { stringReplaceFunction } from "../prebuilt-functions/string/replace";
import { stringToNumberBopsFunction } from "../prebuilt-functions/string/to-number";
import { FunctionManager } from "./function-manager";
import { executeWithArgs } from "../prebuilt-functions/system/execute-with-args";


export class InternalFunctionManagerClass implements FunctionManager {
  private functionMap = new Map<string, Function>()

  public get (functionName : string) : Function {
    return this.functionMap.get(functionName);
  }

  public add (functionName : string, declaration : Function) : void {
    this.functionMap.set(functionName, declaration);
  }

  public functionIsInstalled (functionName : string) : boolean {
    return this.get(functionName) !== undefined;
  }

  public replace (functionName : string, declaration : Function) : void {
    this.functionMap.delete(functionName);
    this.add(functionName, declaration);
  }
}

const internalFunctionManager = new InternalFunctionManagerClass();

// Math Functions
internalFunctionManager.add("add", addBopsFunction);
internalFunctionManager.add("subtract", subtractBopsFunction);
internalFunctionManager.add("divide", divideBopsFunction);
internalFunctionManager.add("multiply", multiplyBopsFunction);
internalFunctionManager.add("absolute", absoluteBopsFunction);
internalFunctionManager.add("exponential", exponentialBopsFunction);
internalFunctionManager.add("modulus", modulusBopsFunction);
internalFunctionManager.add("round", roundBopsFunction);
internalFunctionManager.add("sqrt", squareRootBopsFunction);

// Assertion Functions
internalFunctionManager.add("isNill", isNillBopsFunction);

// Boolean Functions
internalFunctionManager.add("boolToNumber", boolToNumberBopsFunction);
internalFunctionManager.add("boolToString", boolToStringBopsFunction);

// Number Functions
internalFunctionManager.add("randomNumber", randomNumberBopsFunction);
internalFunctionManager.add("toExponential", toExponentialBopsFunction);
internalFunctionManager.add("numberToString", numberToStringFunction);

// String Functions
internalFunctionManager.add("charAt", charAtBopsFunction);
internalFunctionManager.add("countString", countStringFunction);
internalFunctionManager.add("indexOf", indexOfStringFunction);
internalFunctionManager.add("stringReplace", stringReplaceFunction);
internalFunctionManager.add("stringToNumber", stringToNumberBopsFunction);

// Object Functions
internalFunctionManager.add("combineObject", combineObjectBopsFunction);
internalFunctionManager.add("createObject", createObjectBopsFunction);
internalFunctionManager.add("getObjectValue", getObjectPropertyValueBopsFunction);
internalFunctionManager.add("objectKeys", getObjectKeysBopsFunction);
internalFunctionManager.add("objectValues", getObjectValuesBopsFunction);
internalFunctionManager.add("objectToString", objectToStringBopsFunction);

// Array Functions
internalFunctionManager.add("join", arrayJoinBopsFunction);
internalFunctionManager.add("findIndex", arrayFindIndexBopsFunction);
internalFunctionManager.add("includes", arrayIncludesBopsFunction);
internalFunctionManager.add("arrayAt", arrayAtBopsFunction);
internalFunctionManager.add("arrayLength", arrayLengthBopsFunction);
internalFunctionManager.add("push", arrayPushBopsFunction);
internalFunctionManager.add("arrayRemove", arrayRemoveBopsFunction);

// Logic Functions
internalFunctionManager.add("and", andGateBopsFunction);
internalFunctionManager.add("equalTo", isEqualToBopsFunction);
internalFunctionManager.add("higherThan", higherThanBopsFunction);
internalFunctionManager.add("higherOrEqualTo", higherOrEqualToBopsFunction);
internalFunctionManager.add("lowerOrEqualTo", lowerOrEqualToBopsFunction);
internalFunctionManager.add("lowerThan", lowerThanBopsFunction);
internalFunctionManager.add("not", notBopsFunction);
internalFunctionManager.add("or", orGateBopsFunction);

// Flux-Control Functions
internalFunctionManager.add("if", ifBopsFunction);
internalFunctionManager.add("tryCatch", tryCatchBopsFunction);
internalFunctionManager.add("forLoop", forLoopFunction);

// Date Functions
internalFunctionManager.add("dateNow", dateNowBopsFunction);

// System Functions
internalFunctionManager.add("getSystemFunction", getSystemFunction);
internalFunctionManager.add("executeWithArgs", executeWithArgs);

export default internalFunctionManager;
