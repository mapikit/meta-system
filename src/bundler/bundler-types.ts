export type FileImportInfo = {
  fullString : string,
  originFile : string,
  parentFile : string,
  importedObjects : Array<string>,
  defaultImportAlias ?: string,
}

export type StaticImportInfo = string

export type ImportInfo = {
  fileImports : Array<FileImportInfo>;
  staticImports : Set<StaticImportInfo>;
}

export type ImportStatements = {
  ESImports : {
    static : Array<RegExpMatchArray>,
    dynamic : Array<RegExpMatchArray>,
  },
  CJSImports : Array<RegExpMatchArray>,
};
