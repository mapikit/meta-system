export type QueryType = {
  [K : string] : PropertyQuery;
}

export type PropertyQuery = TypeStringQuery | TypeNumberQuery
| TypeDateQuery | TypeBooleanQuery | TypeStringArrayQuery | QueryType
| TypeNumberArrayQuery | TypeBooleanArrayQuery | TypeDateArrayQuery
| TypeObjectArrayQuery;

export enum QueryTypes {
  string,
  number,
  date,
  boolean,
  stringArray,
  numberArray,
  booleanArray,
  dateArray,
  object,
  objectArray,
}

export interface TypeStringQuery {
  equal_to ?: string;
  not_equal_to ?: string;
  one_of ?: string[];
  not_one_of ?: string[];
  exists ?: boolean;
  regexp ?: string;
}

export interface TypeNumberQuery {
  equal_to ?: number;
  not_equal_to ?: number;
  greater_than ?: number;
  greater_or_equal_to ?: number;
  lower_than ?: number;
  lower_or_equal_to ?: number;
  one_of ?: number[];
  not_one_of ?: number[];
  exists ?: boolean;
}

export interface TypeDateQuery {
  equal_to ?: string;
  not_equal_to ?: string;
  greater_than ?: string;
  greater_or_equal_to ?: string;
  lower_than ?: string;
  lower_or_equal_to ?: string;
  one_of ?: string[];
  not_one_of ?: string[];
  exists ?: boolean;
}

export interface TypeBooleanQuery {
  equal_to ?: boolean;
  not_equal_to ?: boolean;
  exists ?: boolean;
}

// Base class - Don't put it in PropertyQuery
interface TypeArrayQuery {
  size ?: number;
  exists ?: boolean;
}

export interface TypeStringArrayQuery extends TypeArrayQuery {
  all_are_equal_to ?: string;
  all_are_not_equal_to ?: string;
  all_are_one_of ?: string[];
  all_are_not_one_of ?: string[];
  all_are_regexp ?: string;
  at_least_one_is_equal_to ?: string;
  at_least_one_is_not_equal_to ?: string;
  at_least_one_is_one_of ?: string[];
  at_least_one_is_not_one_of ?: string[];
  at_least_one_is_regexp ?: string;
}

export interface TypeNumberArrayQuery extends TypeArrayQuery {
  all_are_equal_to ?: number;
  all_are_not_equal_to ?: number;
  all_are_greater_than ?: number;
  all_are_greater_or_equal_to ?: number;
  all_are_lower_than ?: number;
  all_are_lower_or_equal_to ?: number;
  all_are_one_of ?: number[];
  all_are_not_one_of ?: number[];
  at_least_one_is_equal_to ?: number;
  at_least_one_is_not_equal_to ?: number;
  at_least_one_is_greater_than ?: number;
  at_least_one_is_greater_or_equal_to ?: number;
  at_least_one_is_lower_than ?: number;
  at_least_one_is_lower_or_equal_to ?: number;
  at_least_one_is_one_of ?: number[];
  at_least_one_is_not_one_of ?: number[];
}

export interface TypeBooleanArrayQuery extends TypeArrayQuery {
  all_are_equal_to ?: boolean;
  all_are_not_equal_to ?: boolean;
  at_least_one_is_equal_to ?: boolean;
  at_least_one_is_not_equal_to ?: boolean;
}

export interface TypeDateArrayQuery extends TypeArrayQuery {
  all_are_equal_to ?: string;
  all_are_not_equal_to ?: string;
  all_are_greater_than ?: string;
  all_are_greater_or_equal_to ?: string;
  all_are_lower_than ?: string;
  all_are_lower_or_equal_to ?: string;
  all_are_one_of ?: string[];
  all_are_not_one_of ?: string[];
  at_least_one_is_equal_to ?: string;
  at_least_one_is_not_equal_to ?: string;
  at_least_one_is_greater_than ?: string;
  at_least_one_is_greater_or_equal_to ?: string;
  at_least_one_is_lower_than ?: string;
  at_least_one_is_lower_or_equal_to ?: string;
  at_least_one_is_one_of ?: string[];
  at_least_one_is_not_one_of ?: string[];
  at_least_one_is_exists ?: boolean;
}

export interface TypeObjectArrayQuery extends TypeArrayQuery {
  all_are : QueryType;
  at_least_one_is : QueryType;
}
