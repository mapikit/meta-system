import { HTTP_JSONBODY_CONFIGURATION, HTTPRouteConfiguration } from "./configuration";

export function ishttpJsonBodyConfiguration (object : unknown) : asserts object is HTTP_JSONBODY_CONFIGURATION {
  const configurationLikeObject = object as HTTP_JSONBODY_CONFIGURATION;

  if (typeof configurationLikeObject.port !== "number") {
    throw Error("No port was specified for the configuration of HTTP_JSONBODY protocol");
  }

  if (!Array.isArray(configurationLikeObject.routes)) {
    throw Error("Routes configuration is not an Array for HTTP_JSONBODY protocol");
  }

  configurationLikeObject.routes.forEach((routeConfig) => {
    isRouteConfiguration(routeConfig);
  });
};

function isRouteConfiguration (object : unknown) : asserts object is HTTPRouteConfiguration {
  const routeConfig = object as HTTPRouteConfiguration;

  if (typeof routeConfig.route !== "string") {
    throw Error("Configured route for HTTP_JSONBODY protocol is not a string");
  }

  if (typeof routeConfig.businessOperation !== "string") {
    throw Error("No Business Operation specified for linking in the HTTP_JSONBODY protocol");
  }

  const availableMethods = ["GET", "PUT", "POST", "PATCH", "DELETE"];
  if (!availableMethods.includes(routeConfig.method)) {
    throw Error(`HTTP Method not accepted "${routeConfig.method}" at HTTP_JSONBODY protocol`);
  }

  isResultMapConfiguration(routeConfig.resultMapConfiguration);
  isInputMapConfiguration(routeConfig.inputMapConfiguration);
}

// eslint-disable-next-line max-lines-per-function
function isResultMapConfiguration (object : unknown) :
asserts object is HTTPRouteConfiguration["resultMapConfiguration"] {
  const resultConfig = object as HTTPRouteConfiguration["resultMapConfiguration"];

  if (typeof resultConfig !== "object") {
    throw Error("Configuration of result for an HTTP_JSONBODY protocol route should be an object");
  }

  if (!Array.isArray(resultConfig.headers)) {
    throw Error("Headers configuration for an HTTP_JSONBODY protocol route should be an Array");
  }

  resultConfig.headers.forEach((headersConfig) => {
    const headersKeys = Object.keys(headersConfig);
    if (headersKeys.length > 1) {
      throw Error ("Headers should have only a single key in the HTTP_JSONBODY protocol results");
    };

    if (typeof headersConfig[headersKeys[0]] !== "string") {
      throw Error ("The value of a header must be a string in the HTTP_JSONBODY protocol results");
    }
  });

  if (typeof resultConfig.statusCode !== "string" && typeof resultConfig.statusCode !== "number") {
    throw Error("Status Code for an HTTP_JSONBODY protocol result must be either a string or a number");
  }

  isResultMapBody(resultConfig.body);
}

function isResultMapBody (object : unknown) :
asserts object is HTTPRouteConfiguration["resultMapConfiguration"]["body"] {
  const bodyConfig = object as HTTPRouteConfiguration["resultMapConfiguration"]["body"];

  Object.keys(bodyConfig).forEach((outputKey) => {
    if (typeof bodyConfig[outputKey] === "object") {
      isResultMapBody(bodyConfig[outputKey]);

      return;
    }

    if (typeof bodyConfig[outputKey] !== "string") {
      throw Error("Elements of the Body result for an HTTP_JSONBODY protocol route" +
        " configuration should be an Array of strings, an Object or a string");
    }
  });
}

// eslint-disable-next-line max-lines-per-function
function isInputMapConfiguration (object : unknown) :
asserts object is HTTPRouteConfiguration["inputMapConfiguration"] {
  if (!Array.isArray(object)) {
    throw Error("Input map configuration must be an array at HTTP_JSONBODY protocol route");
  }

  const inputMapConfig = object as HTTPRouteConfiguration["inputMapConfiguration"];

  inputMapConfig.forEach((inputConfig) => {
    const validOrigins = ["body", "route", "queryParams", "headers"];
    if (!validOrigins.includes(inputConfig.origin)) {
      throw Error ("Origin of input at HTTP_JSONBODY protocol route must be one of the following values:"
        + validOrigins.join(", "));
    }

    if (typeof inputConfig.originPath !== "string") {
      throw Error ("OriginPath of input at HTTP_JSONBODY protocol route must be a string");
    }

    if (typeof inputConfig.targetPath !== "string") {
      throw Error ("TargetPath of input at HTTP_JSONBODY protocol route must be a string");
    }
  });
}
