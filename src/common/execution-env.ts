class Environment {
  public variables : Record<string, unknown> = {};
  public constants : Record<string, unknown> = new Proxy({}, {
    set: constantSetter,
    defineProperty: constantSetter,
    deleteProperty: (o, property) : true => {
      console.log(`Cannot delete constant property ${String(property)}`);
      return true;
    },
  });
}

function constantSetter (object : object, property : string, value : unknown) : true {
  if(Object.keys(object).includes(property)) {
    console.error(
      `Environment constant "${property}" already exists. Resetting its value is not allowed.\n` +
      "Use environment.variables if you need a variable environment value",
    );
  } else object[property] = value;
  return true;
}

export const environment = new Environment();
