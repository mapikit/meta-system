/* eslint-disable max-len */
import {
  QueryType,
  QueryTypes,
  TypeBooleanArrayQuery,
  TypeBooleanQuery,
  TypeDateArrayQuery,
  TypeDateQuery,
  TypeNumberArrayQuery,
  TypeNumberQuery,
  TypeObjectArrayQuery,
  TypeStringArrayQuery,
  TypeStringQuery,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { QuerySelector } from "mongodb";

export const valueToReplaceString = "__value__";
export const valueToReplaceStringArray = [valueToReplaceString];
export const valueToReplaceBoolean = Boolean();
export const valueToReplaceNumber = Number.NaN;
export const valueToReplaceNumberArray = [valueToReplaceNumber];
export const valueToReplaceDate = new Date(- Math.PI * 1000000000000);
export const valueToReplaceDateArray = [valueToReplaceDate];
export const valueToReplaceBooleanArray = [valueToReplaceBoolean];
export const valueToReplaceObject = { 0: null };
export const valueToReplaceObjectArray = [valueToReplaceObject];

export const stringQueryTranslationMap : Map<keyof TypeStringQuery, QuerySelector<string>> = new Map();
stringQueryTranslationMap.set("equal_to", Object.freeze({ "$eq": valueToReplaceString }));
stringQueryTranslationMap.set("not_equal_to", Object.freeze({ "$ne": valueToReplaceString }));
stringQueryTranslationMap.set("one_of", Object.freeze({ "$in": valueToReplaceStringArray }));
stringQueryTranslationMap.set("not_one_of", Object.freeze({ "$nin": valueToReplaceStringArray }));
stringQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
stringQueryTranslationMap.set("regexp", Object.freeze({ "$regex": valueToReplaceString }));

export const numberQueryTranslationMap : Map<keyof TypeNumberQuery, QuerySelector<number>> = new Map();
numberQueryTranslationMap.set("equal_to", Object.freeze({ "$eq": valueToReplaceNumber }));
numberQueryTranslationMap.set("not_equal_to", Object.freeze({ "$ne": valueToReplaceNumber }));
numberQueryTranslationMap.set("greater_than", Object.freeze({ "$gt": valueToReplaceNumber }));
numberQueryTranslationMap.set("greater_or_equal_to", Object.freeze({ "$gte": valueToReplaceNumber }));
numberQueryTranslationMap.set("lower_than", Object.freeze({ "$lt": valueToReplaceNumber }));
numberQueryTranslationMap.set("lower_or_equal_to", Object.freeze({ "$lte": valueToReplaceNumber }));
numberQueryTranslationMap.set("one_of", Object.freeze({ "$in": valueToReplaceNumberArray }));
numberQueryTranslationMap.set("not_one_of", Object.freeze({ "$nin": valueToReplaceNumberArray }));
numberQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));

export const booleanQueryTranslationMap : Map<keyof TypeBooleanQuery, QuerySelector<boolean>> = new Map();
booleanQueryTranslationMap.set("equal_to", Object.freeze({ "$eq": valueToReplaceBoolean }));
booleanQueryTranslationMap.set("not_equal_to", Object.freeze({ "$ne": valueToReplaceBoolean }));
booleanQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));

export const dateQueryTranslationMap : Map<keyof TypeDateQuery, QuerySelector<Date>> = new Map();
dateQueryTranslationMap.set("equal_to", Object.freeze({ "$eq": valueToReplaceDate }));
dateQueryTranslationMap.set("not_equal_to", Object.freeze({ "$ne": valueToReplaceDate }));
dateQueryTranslationMap.set("greater_than", Object.freeze({ "$gt": valueToReplaceDate }));
dateQueryTranslationMap.set("greater_or_equal_to", Object.freeze({ "$gte": valueToReplaceDate }));
dateQueryTranslationMap.set("lower_than", Object.freeze({ "$lt": valueToReplaceDate }));
dateQueryTranslationMap.set("lower_or_equal_to", Object.freeze({ "$lte": valueToReplaceDate }));
dateQueryTranslationMap.set("one_of", Object.freeze({ "$in": valueToReplaceDateArray }));
dateQueryTranslationMap.set("not_one_of", Object.freeze({ "$nin": valueToReplaceDateArray }));
dateQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));

export const stringArrayQueryTranslationMap :
Map<keyof TypeStringArrayQuery, QuerySelector<Array<string>>> = new Map();
stringArrayQueryTranslationMap.set("contains", Object.freeze({ "$all": [valueToReplaceString] }));
stringArrayQueryTranslationMap.set("contains_all", Object.freeze({ "$all": valueToReplaceStringArray }));
stringArrayQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
stringArrayQueryTranslationMap.set("identical_to", Object.freeze({ "$eq": valueToReplaceStringArray }));
stringArrayQueryTranslationMap.set("contains_one_of", Object.freeze({ "$elemMatch": { "$in": valueToReplaceStringArray } }));
stringArrayQueryTranslationMap.set("contains_none_of", Object.freeze({ "$elemMatch": { "$nin": valueToReplaceStringArray } }));
stringArrayQueryTranslationMap.set("not_contains", Object.freeze({ "$elemMatch": { "$not": valueToReplaceString } }));
stringArrayQueryTranslationMap.set("size", Object.freeze({ "$size": valueToReplaceNumber }));
stringArrayQueryTranslationMap.set("contains_regexp", Object.freeze({ "$elemMatch": { "$regex": valueToReplaceString } }));

export const numberArrayQueryTranslationMap :
Map<keyof TypeNumberArrayQuery, QuerySelector<Array<number>>> = new Map();
numberArrayQueryTranslationMap.set("contains", Object.freeze({ "$all": [valueToReplaceNumber] }));
numberArrayQueryTranslationMap.set("contains_all", Object.freeze({ "$all": valueToReplaceNumberArray }));
numberArrayQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
numberArrayQueryTranslationMap.set("identical_to", Object.freeze({ "$eq": valueToReplaceNumberArray }));
numberArrayQueryTranslationMap.set("contains_one_of", Object.freeze({ "$elemMatch": { "$in": valueToReplaceNumberArray } }));
numberArrayQueryTranslationMap.set("contains_none_of", Object.freeze({ "$elemMatch": { "$nin": valueToReplaceNumberArray } }));
numberArrayQueryTranslationMap.set("not_contains", Object.freeze({ "$elemMatch": { "$not": valueToReplaceNumber } }));
numberArrayQueryTranslationMap.set("size", Object.freeze({ "$size": valueToReplaceNumber }));
numberArrayQueryTranslationMap.set("contains_higher_than", Object.freeze({ "$elemMatch": { "$gt": valueToReplaceNumber } }));
numberArrayQueryTranslationMap.set("contains_higher_or_equal_to", Object.freeze({ "$elemMatch": { "$gte": valueToReplaceNumber } }));
numberArrayQueryTranslationMap.set("contains_lower_than", Object.freeze({ "$elemMatch": { "$lt": valueToReplaceNumber } }));
numberArrayQueryTranslationMap.set("contains_lower_or_equal_to", Object.freeze({ "$elemMatch": { "$lte": valueToReplaceNumber } }));

export const booleanArrayQueryTranslationMap :
Map<keyof TypeBooleanArrayQuery, QuerySelector<Array<boolean>>> = new Map();
booleanArrayQueryTranslationMap.set("contains", Object.freeze({ "$all": [valueToReplaceBoolean] }));
booleanArrayQueryTranslationMap.set("contains_all", Object.freeze({ "$all": valueToReplaceBooleanArray }));
booleanArrayQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
booleanArrayQueryTranslationMap.set("identical_to", Object.freeze({ "$eq": valueToReplaceBooleanArray }));
booleanArrayQueryTranslationMap.set("contains_one_of", Object.freeze({ "$elemMatch": { "$in": valueToReplaceBooleanArray } }));
booleanArrayQueryTranslationMap.set("contains_none_of", Object.freeze({ "$elemMatch": { "$nin": valueToReplaceBooleanArray } }));
booleanArrayQueryTranslationMap.set("not_contains", Object.freeze({ "$elemMatch": { "$not": valueToReplaceBoolean } }));
booleanArrayQueryTranslationMap.set("size", Object.freeze({ "$size": valueToReplaceNumber }));

export const dateArrayQueryTranslationMap :
Map<keyof TypeDateArrayQuery, QuerySelector<Array<Date>>> = new Map();
dateArrayQueryTranslationMap.set("contains", Object.freeze({ "$all": [valueToReplaceDate] }));
dateArrayQueryTranslationMap.set("contains_all", Object.freeze({ "$all": valueToReplaceDateArray }));
dateArrayQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
dateArrayQueryTranslationMap.set("identical_to", Object.freeze({ "$eq": valueToReplaceDateArray }));
dateArrayQueryTranslationMap.set("contains_one_of", Object.freeze({ "$elemMatch": { "$in": valueToReplaceDateArray } }));
dateArrayQueryTranslationMap.set("contains_none_of", Object.freeze({ "$elemMatch": { "$nin": valueToReplaceDateArray } }));
dateArrayQueryTranslationMap.set("not_contains", Object.freeze({ "$elemMatch": { "$not": valueToReplaceDate } }));
dateArrayQueryTranslationMap.set("size", Object.freeze({ "$size": valueToReplaceNumber }));
dateArrayQueryTranslationMap.set("contains_higher_than", Object.freeze({ "$elemMatch": { "$gt": valueToReplaceDate } }));
dateArrayQueryTranslationMap.set("contains_higher_or_equal_to", Object.freeze({ "$elemMatch": { "$gte": valueToReplaceDate } }));
dateArrayQueryTranslationMap.set("contains_lower_than", Object.freeze({ "$elemMatch": { "$lt": valueToReplaceDate } }));
dateArrayQueryTranslationMap.set("contains_lower_or_equal_to", Object.freeze({ "$elemMatch": { "$lte": valueToReplaceDate } }));

export const objectArrayQueryTranslationMap :
Map<keyof TypeObjectArrayQuery, QuerySelector<Array<object>>> = new Map();
objectArrayQueryTranslationMap.set("contains", Object.freeze({ "$all": [{ "$elemMatch": valueToReplaceObject }] }));
objectArrayQueryTranslationMap.set("contains_all", Object.freeze({ "$all": valueToReplaceObjectArray }));
objectArrayQueryTranslationMap.set("exists", Object.freeze({ "$exists": valueToReplaceBoolean }));
objectArrayQueryTranslationMap.set("identical_to", Object.freeze({ "$eq": valueToReplaceObjectArray }));
objectArrayQueryTranslationMap.set("contains_one_of", Object.freeze({ "$elemMatch": { "$in": valueToReplaceObjectArray } }));
objectArrayQueryTranslationMap.set("contains_none_of", Object.freeze({ "$elemMatch": { "$nin": valueToReplaceObjectArray } }));
objectArrayQueryTranslationMap.set("not_contains", Object.freeze({ "$elemMatch": { "$not": valueToReplaceObject } }));
objectArrayQueryTranslationMap.set("size", Object.freeze({ "$size": valueToReplaceNumber }));

export const queryTranslationMap : Map<QueryTypes, Map<keyof QueryType, QuerySelector<unknown>>> = new Map();
queryTranslationMap.set(QueryTypes.string, stringQueryTranslationMap);
queryTranslationMap.set(QueryTypes.number, numberQueryTranslationMap);
queryTranslationMap.set(QueryTypes.date, dateQueryTranslationMap);
queryTranslationMap.set(QueryTypes.boolean, booleanQueryTranslationMap);
queryTranslationMap.set(QueryTypes.stringArray, stringArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.numberArray, numberArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.booleanArray, booleanArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.dateArray, dateArrayQueryTranslationMap);
queryTranslationMap.set(QueryTypes.objectArray, objectArrayQueryTranslationMap);
