/* eslint-disable max-len */
import { ModuleResolverOutput } from "@api/bops-functions/bops-engine/module-types";
import { addBopsFunction, addFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/add";
import * as divide from "@api/bops-functions/prebuilt-functions/math/divide";
import { multiplyBopsFunction, multiplyFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/multipy";
import { subtractBopsFunction, subtractFunctionInformation } from "@api/bops-functions/prebuilt-functions/math/subtract";

const prebuiltFuntions = new Map<string, ModuleResolverOutput>();

// Math Functions
prebuiltFuntions.set("add", { main: addBopsFunction, outputData: addFunctionInformation.outputData });
prebuiltFuntions.set("subtract", { main: subtractBopsFunction, outputData: subtractFunctionInformation.outputData });
prebuiltFuntions.set("divide", { main: divide.divideBopsFunction, outputData: divide.subtractFunctionInformation.outputData });
prebuiltFuntions.set("multiply", { main: multiplyBopsFunction, outputData: multiplyFunctionInformation.outputData });

// Boolean Functions

// Number Functions

// String Functions

// Object Functions

// Array Functions

// Logic Functions


export default prebuiltFuntions;
