// eslint-disable-next-line max-lines-per-function
export const createObjectIdentationUpToStep = (object : object, path : string) : void => {
  const pathSteps = path.split(".");

  let currentReference = object;
  for (let i = 0; i <= pathSteps.length - 1; i++) {
    if (currentReference[pathSteps[i]] === undefined) {
      currentReference[pathSteps[i]] = {};
    }

    currentReference = currentReference[pathSteps[i]];
  }
};
