import { MetaFunction } from "meta-function-helper";
import create from "../application/schema-bops-funtions/create-function/meta-function.json";
import getById from "../application/schema-bops-funtions/get-by-id-function/meta-function.json";
import updateById from "../application/schema-bops-funtions/update-by-id/meta-function.json";
import deleteById from "../application/schema-bops-funtions/delete-by-id/meta-function.json";
import get from "../application/schema-bops-funtions/get/meta-function.json";
import update from "../application/schema-bops-funtions/update/meta-function.json";

const schemaFunctionsConfig = new Map<string, MetaFunction>();

schemaFunctionsConfig.set("create", create);
schemaFunctionsConfig.set("getById", getById);
schemaFunctionsConfig.set("updateById", updateById);
schemaFunctionsConfig.set("deleteById", deleteById);
schemaFunctionsConfig.set("get", get);
schemaFunctionsConfig.set("update", update);

export { schemaFunctionsConfig };
