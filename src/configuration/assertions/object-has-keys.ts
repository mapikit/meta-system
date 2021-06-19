export function objectHasKeys (input : object, keys : string[], objectType ?: string) : void {
  const inputKeys = Object.keys(input);

  const type = objectType ?? "Expected Type";

  keys.forEach((requiredKey) => {
    if (!inputKeys.includes(requiredKey)) {
      throw new Error(`${type} with incorrect format found: Missing key "${requiredKey}"`);
    }
  });
};
