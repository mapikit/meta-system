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
    "version": { "type": "string" },
    "source": { "type": "string" },
    "collectStrategy": { "type": "enum", "subtype": ["npm", "file", "url"] },
    "configuration": { "type": "cloudedObject" },
  } },
  "businessOperations": { "type": "array", "subtype": {
    "ttl": { "type": "number" },
    "name": { "type": "string" },
    "input": { "type": "__%objdef%__" },
    "output": { "type": "__%objdef%__" },
    "identifier": { "type": "string" },
    "constants": { "type": "array", "subtype": {
      "name": { "type": "string" },
      "type": { "type": "enum", "subtype": [ "string", "number", "boolean", "date", "object" ] },
      "value": { "type": "any" },
    } },
    "variables": { "type": "array", "subtype": {
      "name": { "type": "string" },
      "type": { "type": "enum", "subtype": [
        "string", "number", "boolean", "date", "object", "any", "cloudedObject", "function",
      ] },
      "initialValue": { "type": "any" },
    } },
    "configuration": { "type": "array", "subtype": {
      "moduleType": {
        "type": "enum",
        "subtype": [ "internal", "addon", "bop", "variable", "output", "schemaFunction" ],
      },
      "moduleName": { "type": "string" },
      "modulePackage": { "type": "string" },
      "key": { "type": "number" },
      "dependencies": { "type": "array", "subtype": {
        "origin": [
          { "type": "enum", "subtype": ["constants", "constant", "variables", "variable", "input", "env" ] },
          { "type": "number" },
        ],
        "originPath": { "type": "string" },
        "targetPath": { "type": "string" },
      } },
    } },

  } },
};
