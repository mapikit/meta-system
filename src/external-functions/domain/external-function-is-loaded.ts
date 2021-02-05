/**
 * Checks if a required external function is already loaded in the systems memory
 */
export const externalFunctionIsLoaded = (functionRepositoryUrl : string) : boolean  => {
  // This method assumes we will use a download-once strategy to load the code and save it in memory.
  // When done, the following empty list should be replaced with the local pointer to the files
  // or the memory reference to the files. Even more optimally, we can make a class to handle these operations.
  // const loadedFunctions = [];
  console.log("Function being checked:", functionRepositoryUrl);

  // TODO: Build a strategy to name the custom functions out of the functionRepositoryUrl
  return true;
};
