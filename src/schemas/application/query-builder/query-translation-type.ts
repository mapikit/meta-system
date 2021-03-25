import {
  QueryType,
  QueryTypes,
  TypeBooleanArrayQuery,
  TypeBooleanQuery,
  TypeDateQuery,
  TypeNumberArrayQuery,
  TypeNumberQuery,
  TypeStringArrayQuery,
  TypeStringQuery,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { QuerySelector } from "mongodb";

const valueToReplaceString = "__value__";
const valueToReplaceStringArray = [valueToReplaceString];
const valueToReplaceBoolean = Boolean();
const valueToReplaceNumber = Number.NaN;
const valueToReplaceNumberArray = [valueToReplaceNumber];
const valueToReplaceDate = new Date(- Math.PI * 1000000000000);
const valueToReplaceDateArray = [valueToReplaceDate];
const valueToReplaceBooleanArray = [valueToReplaceBoolean];

export const stringQueryTranslationMap : Map<keyof TypeStringQuery, QuerySelector<string>> = new Map();
stringQueryTranslationMap.set("equal_to", { "$eq": valueToReplaceString });
stringQueryTranslationMap.set("not_equal_to", { "$ne": valueToReplaceString });
stringQueryTranslationMap.set("one_of", { "$in": valueToReplaceStringArray });
stringQueryTranslationMap.set("not_one_of",{ "$nin": valueToReplaceStringArray });
stringQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });
stringQueryTranslationMap.set("regexp", { "$regex": valueToReplaceString });

export const numberQueryTranslationMap : Map<keyof TypeNumberQuery, QuerySelector<number>> = new Map();
numberQueryTranslationMap.set("equal_to", { "$eq": valueToReplaceNumber });
numberQueryTranslationMap.set("not_equal_to", { "$ne": valueToReplaceNumber });
numberQueryTranslationMap.set("greater_than", { "$gt": valueToReplaceNumber });
numberQueryTranslationMap.set("greater_or_equal_to", { "$gte": valueToReplaceNumber });
numberQueryTranslationMap.set("lower_than", { "$lt": valueToReplaceNumber });
numberQueryTranslationMap.set("lower_or_equal_to", { "$lte": valueToReplaceNumber });
numberQueryTranslationMap.set("one_of", { "$in": valueToReplaceNumberArray });
numberQueryTranslationMap.set("not_one_of", { "$nin": valueToReplaceNumberArray });
numberQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });

export const booleanQueryTranslationMap : Map<keyof TypeBooleanQuery, QuerySelector<boolean>> = new Map();
booleanQueryTranslationMap.set("equal_to", { "$eq": valueToReplaceBoolean });
booleanQueryTranslationMap.set("not_equal_to", { "$ne": valueToReplaceBoolean });
booleanQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });

export const dateQueryTranslationMap : Map<keyof TypeDateQuery, QuerySelector<Date>> = new Map();
dateQueryTranslationMap.set("equal_to", { "$eq": valueToReplaceDate });
dateQueryTranslationMap.set("not_equal_to", { "$ne": valueToReplaceDate });
dateQueryTranslationMap.set("greater_than", { "$gt": valueToReplaceDate });
dateQueryTranslationMap.set("greater_or_equal_to", { "$gte": valueToReplaceDate });
dateQueryTranslationMap.set("lower_than", { "$lt": valueToReplaceDate });
dateQueryTranslationMap.set("lower_or_equal_to", { "$lte": valueToReplaceDate });
dateQueryTranslationMap.set("one_of", { "$in": valueToReplaceDateArray });
dateQueryTranslationMap.set("not_one_of", { "$nin": valueToReplaceDateArray });
dateQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });

export const stringArrayQueryTranslationMap :
Map<keyof TypeStringArrayQuery, QuerySelector<Array<string>>> = new Map();
stringArrayQueryTranslationMap.set("contains", { "$all": [valueToReplaceString] });
stringArrayQueryTranslationMap.set("contains_all", { "$all": valueToReplaceStringArray });
stringArrayQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });
stringArrayQueryTranslationMap.set("identical_to", { "$eq": valueToReplaceStringArray });
stringArrayQueryTranslationMap.set("contains_one_of", { "$elemMatch": { "$in": valueToReplaceStringArray } });
stringArrayQueryTranslationMap.set("contains_none_of", { "$elemMatch": { "$nin": valueToReplaceStringArray } });
stringArrayQueryTranslationMap.set("not_contains", { "$elemMatch": { "$not": valueToReplaceString } });
stringArrayQueryTranslationMap.set("size", { "$size": valueToReplaceNumber });
stringArrayQueryTranslationMap.set("contains_regexp", { "$elemMatch": { "$regex": valueToReplaceString } });

export const numberArrayQueryTranslationMap :
Map<keyof TypeNumberArrayQuery, QuerySelector<Array<number>>> = new Map();
numberArrayQueryTranslationMap.set("contains", { "$all": [valueToReplaceNumber] });
numberArrayQueryTranslationMap.set("contains_all", { "$all": valueToReplaceNumberArray });
numberArrayQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });
numberArrayQueryTranslationMap.set("identical_to", { "$eq": valueToReplaceNumberArray });
numberArrayQueryTranslationMap.set("contains_one_of", { "$elemMatch": { "$in": valueToReplaceNumberArray } });
numberArrayQueryTranslationMap.set("contains_none_of", { "$elemMatch": { "$nin": valueToReplaceNumberArray } });
numberArrayQueryTranslationMap.set("not_contains", { "$elemMatch": { "$not": valueToReplaceNumber } });
numberArrayQueryTranslationMap.set("size", { "$size": valueToReplaceNumber });
numberArrayQueryTranslationMap.set("contains_higher_than", { "$elemMatch": { "$gt": valueToReplaceNumber } });
numberArrayQueryTranslationMap.set("contains_higher_or_equal_to", { "$elemMatch": { "$gte": valueToReplaceNumber } });
numberArrayQueryTranslationMap.set("contains_lower_than", { "$elemMatch": { "$lt": valueToReplaceNumber } });
numberArrayQueryTranslationMap.set("contains_lower_or_equal_to", { "$elemMatch": { "$lte": valueToReplaceNumber } });

export const booleanArrayQueryTranslationMap :
Map<keyof TypeBooleanArrayQuery, QuerySelector<Array<boolean>>> = new Map();
booleanArrayQueryTranslationMap.set("contains", { "$all": [valueToReplaceBoolean] });
booleanArrayQueryTranslationMap.set("contains_all", { "$all": valueToReplaceBooleanArray });
booleanArrayQueryTranslationMap.set("exists", { "$exists": valueToReplaceBoolean });
booleanArrayQueryTranslationMap.set("identical_to", { "$eq": valueToReplaceBooleanArray });
booleanArrayQueryTranslationMap.set("contains_one_of", { "$elemMatch": { "$in": valueToReplaceBooleanArray } });
booleanArrayQueryTranslationMap.set("contains_none_of", { "$elemMatch": { "$nin": valueToReplaceBooleanArray } });
booleanArrayQueryTranslationMap.set("not_contains", { "$elemMatch": { "$not": valueToReplaceBoolean } });
booleanArrayQueryTranslationMap.set("size", { "$size": valueToReplaceNumber });

export const queryTranslationMap : Map<QueryTypes, Map<keyof QueryType, QuerySelector<unknown>>> = new Map();
queryTranslationMap.set(QueryTypes.string, stringQueryTranslationMap);
queryTranslationMap.set(QueryTypes.number, numberQueryTranslationMap);
queryTranslationMap.set(QueryTypes.date, dateQueryTranslationMap);
queryTranslationMap.set(QueryTypes.boolean, booleanQueryTranslationMap);
queryTranslationMap.set(QueryTypes.stringArray, stringArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.numberArray, numberArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.booleanArray, booleanArrayQueryTranslationMap);

