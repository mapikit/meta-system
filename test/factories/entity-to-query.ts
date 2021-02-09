export const entityToQuery = (entity : object) : string => {
  let query  = "";
  for(const prop in entity) {
    query += typeCreation[typeof entity[prop]](entity[prop], prop);
  }
  return query.substring(1);
};


const typeCreation = {
  string: (string : string, propName : string) : string => { return `&${propName}=${string}`; },
  number: (number : number, propName : string) : string => { return `&${propName}=${number}`; },
  boolean: (bool : boolean, propName : string) : string => { return `&${propName}=${bool.toString()}`; },
  object: (object : object, propName ?: string) : string => {
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
