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
  equal_to ?: Date;
  not_equal_to ?: Date;
  greater_than ?: Date;
  greater_or_equal_to ?: Date;
  lower_than ?: Date;
  lower_or_equal_to ?: Date;
  one_of ?: Date[];
  not_one_of ?: Date[];
  exists ?: boolean;
}

export interface TypeBooleanQuery {
  equal_to ?: boolean;
  not_equal_to ?: boolean;
  exists ?: boolean;
}

// Base class - Don't put it in PropertyQuery
interface TypeArrayQuery<T> {
  identical_to ?: T[];
  contains_all ?: T[];
  contains ?: T;
  not_contains ?: T;
  contains_one_of ?: T[];
  contains_none_of ?: T[];
  size ?: number;
  exists ?: boolean;
}

export interface TypeStringArrayQuery extends TypeArrayQuery<string> {
  contains_regexp ?: string;
}

export interface TypeNumberArrayQuery extends TypeArrayQuery<number> {
  contains_higher_than ?: number;
  contains_higher_or_equal_to ?: number;
  contains_lower_than ?: number;
  contains_lower_or_equal_to ?: number;
}

export type TypeBooleanArrayQuery = TypeArrayQuery<boolean>;

export interface TypeDateArrayQuery extends TypeArrayQuery<Date> {
  contains_higher_than ?: Date;
  contains_higher_or_equal_to ?: Date;
  contains_lower_than ?: Date;
  contains_lower_or_equal_to ?: Date;
}

export type TypeObjectArrayQuery = TypeArrayQuery<object>;
