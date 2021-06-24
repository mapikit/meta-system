/* eslint-disable max-len */
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
import { randomNumberBopsFunction } from "./number/random";
import { toExponentialBopsFunction } from "./number/to-exponential";
import { numberToStringFunction } from "./number/to-string";
import { andGateBopsFunction } from "./logic/and";
import { isEqualToBopsFunction } from "./logic/equal";
import { higherOrEqualToBopsFunction } from "./logic/higher-or-equal-to";
import { higherThanBopsFunction } from "./logic/higher-than";
import { ifBopsFunction } from "./flux-control/if";
import { lowerOrEqualToBopsFunction } from "./logic/lower-or-equal-to";
import { lowerThanBopsFunction } from "./logic/lower-than";
import { notBopsFunction } from "./logic/not";
import { orGateBopsFunction } from "./logic/or";
import { tryCatchBopsFunction } from "./flux-control/try-catch";

const prebuiltFuntions = new Map<string, Function>();

// Math Functions
prebuiltFuntions.set("add", addBopsFunction);
prebuiltFuntions.set("subtract", subtractBopsFunction);
prebuiltFuntions.set("divide", divideBopsFunction);
prebuiltFuntions.set("multiply", multiplyBopsFunction);
prebuiltFuntions.set("absolute", absoluteBopsFunction);
prebuiltFuntions.set("exponential", exponentialBopsFunction);
prebuiltFuntions.set("modulus", modulusBopsFunction);
prebuiltFuntions.set("round", roundBopsFunction);
prebuiltFuntions.set("sqrt", squareRootBopsFunction);

// Boolean Functions
prebuiltFuntions.set("boolToNumber", boolToNumberBopsFunction);
prebuiltFuntions.set("boolToString", boolToStringBopsFunction);

// Number Functions
prebuiltFuntions.set("randomNumber", randomNumberBopsFunction);
prebuiltFuntions.set("toExponential", toExponentialBopsFunction);
prebuiltFuntions.set("numberToString", numberToStringFunction);

// String Functions
prebuiltFuntions.set("charAt", charAtBopsFunction);
prebuiltFuntions.set("countString", countStringFunction);
prebuiltFuntions.set("indexOf", indexOfStringFunction);
prebuiltFuntions.set("stringReplace", stringReplaceFunction);
prebuiltFuntions.set("stringToNumber", stringToNumberBopsFunction);

// Object Functions
prebuiltFuntions.set("combineObject", combineObjectBopsFunction);
prebuiltFuntions.set("createObject", createObjectBopsFunction);
prebuiltFuntions.set("getObjectValue", getObjectPropertyValueBopsFunction);
prebuiltFuntions.set("objectKeys", getObjectKeysBopsFunction);
prebuiltFuntions.set("objectValues", getObjectValuesBopsFunction);
prebuiltFuntions.set("objectToString", objectToStringBopsFunction);

// Array Functions
prebuiltFuntions.set("join", arrayJoinBopsFunction);
prebuiltFuntions.set("findIndex", arrayFindIndexBopsFunction);
prebuiltFuntions.set("includes", arrayIncludesBopsFunction);
prebuiltFuntions.set("arrayAt", arrayAtBopsFunction);
prebuiltFuntions.set("arrayLength", arrayLengthBopsFunction);
prebuiltFuntions.set("push", arrayPushBopsFunction);
prebuiltFuntions.set("arrayRemove", arrayRemoveBopsFunction);

// Logic Functions
prebuiltFuntions.set("and", andGateBopsFunction);
prebuiltFuntions.set("equalTo", isEqualToBopsFunction);
prebuiltFuntions.set("higherThan", higherThanBopsFunction);
prebuiltFuntions.set("higherOrEqualTo", higherOrEqualToBopsFunction);
prebuiltFuntions.set("lowerOrEqualTo", lowerOrEqualToBopsFunction);
prebuiltFuntions.set("lowerThan", lowerThanBopsFunction);
prebuiltFuntions.set("not", notBopsFunction);
prebuiltFuntions.set("or", orGateBopsFunction);

// Flux-Control Functions
prebuiltFuntions.set("if", ifBopsFunction);
prebuiltFuntions.set("tryCatch", tryCatchBopsFunction);

export default prebuiltFuntions;
