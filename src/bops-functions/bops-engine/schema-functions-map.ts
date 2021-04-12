const schemaFunctionsFolders = new Map<string, string>();

schemaFunctionsFolders.set("create", "create-function");
schemaFunctionsFolders.set("deleteById", "delete-by-id");
schemaFunctionsFolders.set("get", "get");
schemaFunctionsFolders.set("getById", "get-by-id-function");
schemaFunctionsFolders.set("updateById", "update-by-id");
//TODO rabase and add update function

export { schemaFunctionsFolders };


