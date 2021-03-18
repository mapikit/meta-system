export const entityToQuery = (entity : object) : string => {
  let query  = "";
  for(const prop in entity) {
    query += typeCreation[typeof entity[prop]](entity[prop], prop);
  }
  return query.substring(1);
};

const typeCreation = {
  string: (string : string, propName : string) : string => `&${propName}=${string}`,
  number: (number : number, propName : string) : string => `&${propName}=${number}`,
  boolean: (bool : boolean, propName : string) : string => `&${propName}=${bool.toString()}`,
  object: (object : object, propName ?: string) : string => {
    // To javascript, both Arrays and Dates are considered Objects. Because of this, it is
    // required to diferentiate between regular Objects, Arrays and Dates.
    if(isArrayOfObjects(object)) return arrayOfObjectsToQuery(object as Array<object>, propName);
    if(object instanceof Array) return `&${propName}[]=` + object.join(`&${propName}[]=`);
    if(object instanceof Date) return `&${propName}=${object.toISOString()}`;

    let query = "";
    for(const prop in object) {
      const header = propName ? `${propName}[${prop}]` : prop;
      query += `${typeCreation[typeof object[prop]](object[prop], header)}`;
    }
    return query;
  },
};

function isArrayOfObjects (object : object) : boolean {
  return object instanceof Array && typeof object[0] === "object";
}

function arrayOfObjectsToQuery (array : Array<object>, propName ?: string) : string {
  let query = "";
  array.forEach((object, index) => {
    query += typeCreation.object(object, `${propName}[${index}]`);
  });
  return  query;
}
