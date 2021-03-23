import {
  QueryType,
  QueryTypes,
  TypeBooleanQuery,
  TypeNumberQuery,
  TypeStringQuery,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { QuerySelector } from "mongodb";

export const stringQueryTranslationMap : Map<keyof TypeStringQuery, keyof QuerySelector<string>> = new Map();
stringQueryTranslationMap.set("equal_to", "$eq");
stringQueryTranslationMap.set("not_equal_to", "$ne");
stringQueryTranslationMap.set("one_of", "$in");
stringQueryTranslationMap.set("not_one_of", "$nin");
stringQueryTranslationMap.set("exists", "$exists");
stringQueryTranslationMap.set("regexp", "$regex");

export const numberQueryTranslationMap : Map<keyof TypeNumberQuery, keyof QuerySelector<number>> = new Map();
numberQueryTranslationMap.set("equal_to", "$eq");
numberQueryTranslationMap.set("not_equal_to", "$ne");
numberQueryTranslationMap.set("greater_than", "$gt");
numberQueryTranslationMap.set("greater_or_equal_to", "$gte");
numberQueryTranslationMap.set("lower_than", "$lt");
numberQueryTranslationMap.set("lower_or_equal_to", "$lte");
numberQueryTranslationMap.set("one_of", "$in");
numberQueryTranslationMap.set("not_one_of", "$nin");
numberQueryTranslationMap.set("exists", "$exists");

export const booleanQueryTranslationMap : Map<keyof TypeBooleanQuery, keyof QuerySelector<boolean>> = new Map();
booleanQueryTranslationMap.set("equal_to", "$eq");
booleanQueryTranslationMap.set("not_equal_to", "$ne");
booleanQueryTranslationMap.set("exists", "$exists");

export const queryTranslationMap : Map<QueryTypes, Map<keyof QueryType, keyof QuerySelector<unknown>>> = new Map();
queryTranslationMap.set(QueryTypes.string, stringQueryTranslationMap);
queryTranslationMap.set(QueryTypes.number, numberQueryTranslationMap);
queryTranslationMap.set(QueryTypes.date, numberQueryTranslationMap); // They are the same

