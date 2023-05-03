export type Addon = {
  version : string;
  source : string;
  identifier : string;
  collectStrategy : "npm" | "url" | "file";
  configuration : unknown;
}