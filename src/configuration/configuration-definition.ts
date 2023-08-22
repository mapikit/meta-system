export const configurationTypeDefinition = {
  "name": { "type": "string", "required": true },
  "version": { "type": "string", "required": true },
  "envs": { "type": "array", "required": true, "subtype": {
    "key": { "type": "string", "required": true },
    "value": { "type": "string", "required": true },
  } },
  "schemas": { "type": "array", "required": true, "subtype": {
    "name": { "type": "string", "required": true },
    "identifier": { "type": "string", "required": true },
    "format": { "type": "__%objdef%__", "required": true },
  } },
  "addons": { "type": "array", "subtype": {
    "identifier": { "type": "string", "required": true },
    "version": { "type": "string" },
    "source": { "type": "string", "required": true },
    "collectStrategy": { "type": "enum", "subtype": ["npm", "file", "url"], "required": true },
    "configuration": { "type": "cloudedObject" },
  }, "required": true },
  "businessOperations": { "type": "array", "required": true, "subtype": {
    "ttl": { "type": "number" },
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
      "modulePackage": { "type": "string" },
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
