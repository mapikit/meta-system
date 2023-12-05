export type FileImportInfo = {
  fullString : string,
  originFile : string,
  parentFile : string,
  importedObjects : Array<{
    value : string,
    alias ?: string
  }>,
  defaultImportAlias ?: string,
}

export type ExportInfo = {
  fullString : string,
  value : string,
  name : string,
  isDefault : boolean
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
