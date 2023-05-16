export const configurationTypeDefinition = {
  "name": { "type": "string" },
  "version": { "type": "string" },
  "envs": { "type": "array", "subtype": {
    "key": { "type": "string" },
    "value": { "type": "string" },
  } },
  "schemas": { "type": "array", "subtype": {
    "name": { "type": "string" },
    "identifier": { "type": "string", "required": true },
    "format": { "type": "__%objdef%__" },
  } },
  "addons": { "type": "array", "subtype": {
    "identifier": { "type": "string", "required": true },
    "version": { "type": "string" },
    "source": { "type": "string", "required": true },
    "collectStrategy": { "type": "enum", "subtype": ["npm", "file", "url"], "required": true },
    "configuration": { "type": "cloudedObject" },
  } },
  "businessOperations": { "type": "array", "subtype": {
    "ttl": { "type": "number" },
    "name": { "type": "string", "required": true },
    "input": { "type": "__%objdef%__", "required": true },
    "output": { "type": "__%objdef%__", "required": true },
    "identifier": { "type": "string", "required": true },
    "constants": { "type": "array", "subtype": {
      "name": { "type": "string" },
      "type": { "type": "enum", "subtype": [ "string", "number", "boolean", "date", "object" ] },
      "value": { "type": "any" },
    }, "required": true },
    "variables": { "type": "array", "subtype": {
      "name": { "type": "string" },
      "type": { "type": "enum", "subtype": [
        "string", "number", "boolean", "date", "object", "any", "cloudedObject", "function",
      ] },
      "initialValue": { "type": "any" },
    }, "required": true },
    "configuration": { "type": "array", "subtype": {
      "moduleType": {
        "type": "enum",
        "subtype": [ "internal", "addon", "bop", "variable", "output", "schemaFunction" ],
        "required": true,
      },
      "moduleName": { "type": "string", "required": true },
      "modulePackage": { "type": "string", "required": true },
      "key": { "type": "number", "required": true },
      "dependencies": { "type": "array", "subtype": {
        "origin": [
          { "type": "enum", "subtype": [
            "constants", "constant", "variables", "variable", "input", "env",
          ], "required": true },
          { "type": "number", "required": true },
        ],
        "originPath": { "type": "string" },
        "targetPath": { "type": "string" },
      }, "required": true },
    }, "required": true },

  } },
};
