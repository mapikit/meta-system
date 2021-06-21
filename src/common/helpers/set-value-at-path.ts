export const setValueAtObjectPath = (object : object, path : string, value ?: unknown) : void => {
  const pathSteps = path.split(".");

  let currentReference = object;
  for (let i = 0; i <= pathSteps.length - 1; i++) {
    if (currentReference[pathSteps[i]] === undefined) {
      if (pathSteps[i] === pathSteps[pathSteps.length - 1]) {
        currentReference[pathSteps[i]] = value;
      } else {
        currentReference[pathSteps[i]] = {};
      }
    }

    currentReference = currentReference[pathSteps[i]];
  }
};
