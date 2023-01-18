import { inspect } from "util";

export function fullObject (object : object) : string {
  return inspect(object, false, null, true);
}
