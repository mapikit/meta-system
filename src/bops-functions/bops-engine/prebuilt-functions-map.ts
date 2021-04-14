/* eslint-disable max-len */
import { ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-types";
import { joinBopsFunction, joinBopsFunctionInformation } from "@api/bops-functions/prebuilt-functions/array/join";
import { absoluteBopsFunction, absoluteFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/absolute";
import { addBopsFunction, addFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/add";
import { divideBopsFunction, divideFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/divide";
import { exponentialBopsFunction, exponentialFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/exponential";
import { modulusBopsFunction, modulusFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/modulus";
import { multiplyBopsFunction, multiplyFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { roundBopsFunction, roundFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/round";
import { squareRootBopsFunction, squareRootFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/square-root";
import { subtractBopsFunction, subtractFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/subtract";

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

// Object Functions

// Array Functions
prebuiltFuntions.set("join", { main: joinBopsFunction, outputData: joinBopsFunctionInformation.outputData });

// Logic Functions


export default prebuiltFuntions;
