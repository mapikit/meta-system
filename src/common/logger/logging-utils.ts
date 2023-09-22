export function fullObject (object : object) : string {
  return JSON.stringify(object, undefined, 2);
}
