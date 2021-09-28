import { InternalMetaFunction } from "bops-functions/internal-meta-function";
import { createInfo } from "./schema-functions-info/create";
import { deleteInfo } from "./schema-functions-info/delete";
import { deleteByIdInfo } from "./schema-functions-info/delete-by-id";
import { getInfo } from "./schema-functions-info/get";
import { getByIdInfo } from "./schema-functions-info/get-by-id";
import { updateInfo } from "./schema-functions-info/update";
import { updateByIdInfo } from "./schema-functions-info/update-by-id";

const schemaFunctionInfoMap = new Map<string, InternalMetaFunction>();


schemaFunctionInfoMap.set("create", createInfo);
schemaFunctionInfoMap.set("get", getInfo);
schemaFunctionInfoMap.set("getById", getByIdInfo);
schemaFunctionInfoMap.set("delete", deleteInfo);
schemaFunctionInfoMap.set("deleteById", deleteByIdInfo);
schemaFunctionInfoMap.set("update", updateInfo);
schemaFunctionInfoMap.set("updateById", updateByIdInfo);

export  { schemaFunctionInfoMap };
