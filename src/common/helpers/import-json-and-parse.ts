export const importJsonAndParse = async <T>(path : string, relativeHome ?: string) : Promise<T> => {
  const { readFileSync } = await import("fs");
  const pathLib = await import("path");
  let usedPath = path;
  if (relativeHome) {
    usedPath = pathLib.resolve(relativeHome, usedPath);
  }
  const imported = readFileSync(pathLib.resolve(usedPath));

  return JSON.parse(imported.toString());
};
