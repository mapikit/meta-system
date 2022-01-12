import { InternalMetaFunction } from "bops-functions/internal-meta-function";
import { SchemasFunctions } from "../domain/schemas-functions";
import { createInfo } from "./schema-functions-info/insert";
import { deleteInfo } from "./schema-functions-info/delete";
import { deleteByIdInfo } from "./schema-functions-info/delete-by-id";
import { getInfo } from "./schema-functions-info/find";
import { getByIdInfo } from "./schema-functions-info/find-by-id";
import { updateInfo } from "./schema-functions-info/update";
import { updateByIdInfo } from "./schema-functions-info/update-by-id";
import { countInfo } from "./schema-functions-info/count";

const schemaFunctionInfoMap = new Map<keyof typeof SchemasFunctions, InternalMetaFunction>();


schemaFunctionInfoMap.set("insert", createInfo);
schemaFunctionInfoMap.set("find", getInfo);
schemaFunctionInfoMap.set("findById", getByIdInfo);
schemaFunctionInfoMap.set("delete", deleteInfo);
schemaFunctionInfoMap.set("deleteById", deleteByIdInfo);
schemaFunctionInfoMap.set("update", updateInfo);
schemaFunctionInfoMap.set("updateById", updateByIdInfo);
schemaFunctionInfoMap.set("count", countInfo);

export  { schemaFunctionInfoMap };
