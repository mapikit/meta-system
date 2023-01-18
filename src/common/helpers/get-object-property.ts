export const getObjectProperty = <T>(object : object, path : string) : T | undefined => {
  const pathSteps = path.split(".");
  let result = undefined;
  let currentObjectRef = object;

  for (const step of pathSteps) {
    result = currentObjectRef[step] ?? undefined;

    if (result === undefined) return undefined;
    currentObjectRef = currentObjectRef[step];
  }

  return result;
};
