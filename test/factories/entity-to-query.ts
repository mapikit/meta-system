export const entityToQuery = (entity : object) : string => {
  let query  = "";
  for(const prop in entity) {
    query += typeCreation[typeof entity[prop]](entity[prop], prop);
  }
  return query.replace("&&", "&").substring(1);
};


const typeCreation = {
  string: (string : string, propName : string) : string => { return `&${propName}=${string}`; },
  number: (number : number, propName : string) : string => { return `&${propName}=${number}`; },
  boolean: (bool : boolean, propName : string) : string => { return `&${propName}=${bool.toString()}`; },
  object: (object : object, recursiveHeader ?: string) : string => {
    if(object instanceof Array) return `&${recursiveHeader}[]=` + object.join(`&${recursiveHeader}[]=`);
    if(object instanceof Date) return `&${recursiveHeader}=${object.toISOString()}`;

    let query = "";
    for(const prop in object) {
      const header = recursiveHeader ? `${recursiveHeader}[${prop}]` : prop;
      query += `${typeCreation[typeof object[prop]](object[prop], header)}`;
    }
    return query;
  },
};
