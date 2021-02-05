// This file should be used to export all internal functions and enumerate them.
// The folder "internal-functions" does not follow the usual |application|domain| separation,
// instead, since each function should be completely independent AND follow the pattern of
// a BOPS function, for each function there is a folder containing the module itself, just like
// an independent complete repository.

// TODO : Import list in runtime and generate the list with all functions available

export const checkInternalFunctionExist = (functionName : string) : boolean => {
  let functionNameToValidate = functionName;

  if (functionNameToValidate.charAt(0) === "#") {
    functionNameToValidate = functionName.substring(1);
  }

  // TODO : Actually check the function list
  return true;
};
