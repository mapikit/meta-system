import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";
import { SchemasFunctions } from "../domain/schemas-functions.js";
import { createInfo } from "./schema-functions-info/insert.js";
import { deleteInfo } from "./schema-functions-info/delete.js";
import { deleteByIdInfo } from "./schema-functions-info/delete-by-id.js";
import { getInfo } from "./schema-functions-info/find.js";
import { getByIdInfo } from "./schema-functions-info/find-by-id.js";
import { updateInfo } from "./schema-functions-info/update.js";
import { updateByIdInfo } from "./schema-functions-info/update-by-id.js";
import { countInfo } from "./schema-functions-info/count.js";

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
