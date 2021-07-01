import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";
import { arrayAtBopsFunction } from "@api/bops-functions/prebuilt-functions/array/array-at";
import { arrayFindIndexBopsFunction } from "@api/bops-functions/prebuilt-functions/array/find-index";
import { arrayIncludesBopsFunction } from "@api/bops-functions/prebuilt-functions/array/inlcudes";
import { arrayJoinBopsFunction } from "@api/bops-functions/prebuilt-functions/array/join";
import { arrayLengthBopsFunction } from "@api/bops-functions/prebuilt-functions/array/length";
import { arrayPushBopsFunction } from "@api/bops-functions/prebuilt-functions/array/push";
import { arrayRemoveBopsFunction } from "@api/bops-functions/prebuilt-functions/array/remove";
import { absoluteBopsFunction } from "@api/bops-functions/prebuilt-functions/math/absolute";
import { addBopsFunction } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction } from "@api/bops-functions/prebuilt-functions/math/divide";
import { exponentialBopsFunction } from "@api/bops-functions/prebuilt-functions/math/exponential";
import { modulusBopsFunction } from "@api/bops-functions/prebuilt-functions/math/modulus";
import { multiplyBopsFunction } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { roundBopsFunction } from "@api/bops-functions/prebuilt-functions/math/round";
import { squareRootBopsFunction } from "@api/bops-functions/prebuilt-functions/math/square-root";
import { subtractBopsFunction } from "@api/bops-functions/prebuilt-functions/math/subtract";
import { combineObjectBopsFunction } from "@api/bops-functions/prebuilt-functions/object/combine";
import { createObjectBopsFunction } from "@api/bops-functions/prebuilt-functions/object/create";
import { getObjectPropertyValueBopsFunction } from "@api/bops-functions/prebuilt-functions/object/get-value";
import { getObjectKeysBopsFunction } from "@api/bops-functions/prebuilt-functions/object/keys";
import { objectToStringBopsFunction } from "@api/bops-functions/prebuilt-functions/object/to-string";
import { getObjectValuesBopsFunction } from "@api/bops-functions/prebuilt-functions/object/values";
import { charAtBopsFunction } from "@api/bops-functions/prebuilt-functions/string/char-at";
import { countStringFunction } from "@api/bops-functions/prebuilt-functions/string/count";
import { indexOfStringFunction } from "@api/bops-functions/prebuilt-functions/string/index-of";
import { stringReplaceFunction } from "@api/bops-functions/prebuilt-functions/string/replace";
import { stringToNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/string/to-number";
import { boolToNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/boolean/bool-to-number";
import { boolToStringBopsFunction } from "@api/bops-functions/prebuilt-functions/boolean/bool-to-string";
import { randomNumberBopsFunction } from "@api/bops-functions/prebuilt-functions/number/random";
import { toExponentialBopsFunction } from "@api/bops-functions/prebuilt-functions/number/to-exponential";
import { numberToStringFunction } from "@api/bops-functions/prebuilt-functions/number/to-string";
import { andGateBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/and";
import { isEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/equal";
import { higherOrEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/higher-or-equal-to";
import { higherThanBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/higher-than";
import { ifBopsFunction } from "@api/bops-functions/prebuilt-functions/flux-control/if";
import { lowerOrEqualToBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/lower-or-equal-to";
import { lowerThanBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/lower-than";
import { notBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/not";
import { orGateBopsFunction } from "@api/bops-functions/prebuilt-functions/logic/or";
import { tryCatchBopsFunction } from "@api/bops-functions/prebuilt-functions/flux-control/try-catch";
import { isNillBopsFunction } from "@api/bops-functions/prebuilt-functions/assertion/is-nill";
import { dateNowBopsFunction } from "@api/bops-functions/prebuilt-functions/date/date-now";

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

// Date Functions
internalFunctionManager.add("dateNow", dateNowBopsFunction);

export default internalFunctionManager;
