export const importJsonAndParse = async <T>(path : string) : Promise<T> => {
  const { readFileSync } = await import("fs");
  const pathLib = await import("path");
  const imported = readFileSync(pathLib.resolve(path));

  return JSON.parse(imported.toString());
}
