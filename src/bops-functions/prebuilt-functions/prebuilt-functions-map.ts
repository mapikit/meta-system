/* eslint-disable max-len */
import { ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-resolver";
import { arrayAtBopsFunction, arrayAtBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/array-at";
import { arrayFindIndexBopsFunction, arrayFindIndexBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/find-index";
import { arrayIncludesBopsFunction, arrayIncludesBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/inlcudes";
import { arrayJoinBopsFunction, arrayJoinBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/join";
import { arrayLengthBopsFunction, arrayLengthBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/length";
import { arrayPushBopsFunction, arrayPushBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/push";
import { arrayRemoveBopsFunction, arrayRemoveBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/remove";
import { absoluteBopsFunction, absoluteFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/absolute";
import { addBopsFunction, addFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction, divideFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/divide";
import { exponentialBopsFunction, exponentialFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/exponential";
import { modulusBopsFunction, modulusFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/modulus";
import { multiplyBopsFunction, multiplyFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { roundBopsFunction, roundFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/round";
import { squareRootBopsFunction, squareRootFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/square-root";
import { subtractBopsFunction, subtractFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/subtract";
import { combineObjectBopsFunction, combineObjectBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/combine";
import { createObjectBopsFunction, createObjectBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/create";
import { getObjectPropertyValueBopsFunction, getObjectPropertyValueBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/get-value";
import { getObjectKeysBopsFunction, getObjectKeysBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/keys";
import { objectToStringBopsFunction, objectToStringBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/to-string";
import { getObjectValuesBopsFunction, getObjectValuesBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/object/values";
import { charAtBopsFunction, charAtBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/string/char-at";
import { countStringFunction, countStringFunctionInformation } from "@api/bops-functions/prebuilt-functions/string/count";
import { indexOfStringFunction, indexOfStringFunctionInformation } from "@api/bops-functions/prebuilt-functions/string/index-of";
import { stringReplaceFunction, stringReplaceFunctionInformation } from "@api/bops-functions/prebuilt-functions/string/replace";
import { stringToNumberBopsFunction, stringToNumberBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/string/to-number";

const prebuiltFuntions = new Map<string, ModuleResolverOutput>();

// Math Functions
prebuiltFuntions.set("add", { main: addBopsFunction, outputData: addFunctionInformation.outputData });
prebuiltFuntions.set("subtract", { main: subtractBopsFunction, outputData: subtractFunctionInformation.outputData });
prebuiltFuntions.set("divide", { main: divideBopsFunction, outputData: divideFunctionInformation.outputData });
prebuiltFuntions.set("multiply", { main: multiplyBopsFunction, outputData: multiplyFunctionInformation.outputData });
prebuiltFuntions.set("absolute", { main: absoluteBopsFunction, outputData: absoluteFunctionInformation.outputData });
prebuiltFuntions.set("exponential", { main: exponentialBopsFunction, outputData: exponentialFunctionInformation.outputData });
prebuiltFuntions.set("modulus", { main: modulusBopsFunction, outputData: modulusFunctionInformation.outputData });
prebuiltFuntions.set("round", { main: roundBopsFunction, outputData: roundFunctionInformation.outputData });
prebuiltFuntions.set("sqrt", { main: squareRootBopsFunction, outputData: squareRootFunctionInformation.outputData });

// Boolean Functions

// Number Functions

// String Functions
prebuiltFuntions.set("charAt", { main: charAtBopsFunction, outputData: charAtBopsFunctionInformation.outputData });
prebuiltFuntions.set("countString", { main: countStringFunction, outputData: countStringFunctionInformation.outputData });
prebuiltFuntions.set("indexOf", { main: indexOfStringFunction, outputData: indexOfStringFunctionInformation.outputData });
prebuiltFuntions.set("stringReplace", { main: stringReplaceFunction, outputData: stringReplaceFunctionInformation.outputData });
prebuiltFuntions.set("stringToNumber", { main: stringToNumberBopsFunction, outputData: stringToNumberBopsFunctionInformation.outputData });

// Object Functions
prebuiltFuntions.set("combineObject", { main: combineObjectBopsFunction, outputData: combineObjectBopsFunctionInformation.outputData });
prebuiltFuntions.set("createObject", { main: createObjectBopsFunction, outputData: createObjectBopsFunctionInformation.outputData });
prebuiltFuntions.set("getObjectValue", { main: getObjectPropertyValueBopsFunction, outputData: getObjectPropertyValueBopsFunctionInformation.outputData });
prebuiltFuntions.set("objectKeys", { main: getObjectKeysBopsFunction, outputData: getObjectKeysBopsFunctionInformation.outputData });
prebuiltFuntions.set("objectValues", { main: getObjectValuesBopsFunction, outputData: getObjectValuesBopsFunctionInformation.outputData });
prebuiltFuntions.set("objectToString", { main: objectToStringBopsFunction, outputData: objectToStringBopsFunctionInformation.outputData });

// Array Functions
prebuiltFuntions.set("join", { main: arrayJoinBopsFunction, outputData: arrayJoinBopsFunctionInformation.outputData });
prebuiltFuntions.set("findIndex", { main: arrayFindIndexBopsFunction, outputData: arrayFindIndexBopsFunctionInformation.outputData });
prebuiltFuntions.set("includes", { main: arrayIncludesBopsFunction, outputData: arrayIncludesBopsFunctionInformation.outputData });
prebuiltFuntions.set("arrayAt", { main: arrayAtBopsFunction, outputData: arrayAtBopsFunctionInformation.outputData });
prebuiltFuntions.set("arrayLength", { main: arrayLengthBopsFunction, outputData: arrayLengthBopsFunctionInformation.outputData });
prebuiltFuntions.set("push", { main: arrayPushBopsFunction, outputData: arrayPushBopsFunctionInformation.outputData });
prebuiltFuntions.set("arrayRemove", { main: arrayRemoveBopsFunction, outputData: arrayRemoveBopsFunctionInformation.outputData });


export default prebuiltFuntions;
