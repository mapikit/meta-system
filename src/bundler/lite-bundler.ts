import type { UnpackedFile } from "nethere/dist/types.js";
import type { ExportInfo, FileImportInfo, ImportInfo, ImportStatements, StaticImportInfo } from "./bundler-types.js";
import { logger } from "../common/logger/logger.js";

export class Bundler {
  private filesList : Record<string, string>;

  constructor (
    private entrypoint : string,
    downloadedData : Array<UnpackedFile>,
    private identifier : string,
  ) { this.filesList = Bundler.assembleList(downloadedData); }

  private static assembleList (fileList : UnpackedFile[]) : Record<string, string> {
    const objectsArray = fileList.map(file => ({ [file.header.fileName] : file.data.toString() }));
    return Object.assign({}, ...objectsArray);
  }

  private grabImportList (filePath : string, importList : ImportInfo = { fileImports: [], staticImports: new Set() })
    : ImportInfo {
    const text = this.filesList[filePath];
    const fileImports = this.grabFileImports(text, filePath);

    const allImports = Array.from(text.matchAll(/import .+ from ".+"/gm)).map(r => r[0]);
    const staticImports = allImports.filter(_import => !fileImports.some(fImport => fImport.fullString === _import));
    importList.fileImports.push(...fileImports);
    staticImports.forEach(_import => {
      importList.staticImports.add(_import);
      this.filesList[filePath] = this.filesList[filePath].replace(_import, "");
    });
    for(const match of fileImports) this.grabImportList(match.originFile, importList);
    return importList;
  }

  private stripUnimported (importList : Array<FileImportInfo>) : void {
    for(const fileName in this.filesList) {
      if(fileName === this.entrypoint) continue;
      if(!importList.find(_import => _import.originFile === fileName)) delete this.filesList[fileName];
    }
  }

  private grabFileImports (text : string, parentFile : string) : Array<FileImportInfo> {
    const imports = this.grabImportStatements(text);
    return [
      ...this.buildImportInfo(imports.CJSImports, parentFile),
      ...this.buildImportInfo(imports.ESImports.dynamic, parentFile),
      ...this.buildImportInfo(imports.ESImports.static, parentFile),
    ];
  }

  private buildImportInfo (imports : Array<RegExpMatchArray>, parentFile : string) : Array<FileImportInfo> {
    return imports.map(match => {
      const objectImports = (match.groups.objects.match(/\{((.)+,?)+\}/) ?? [])[0];
      const defaultImport = match.groups.objects.replace(objectImports, "").match(/\w+/);
      const mapResult = {
        fullString: match[0],
        parentFile,
        originFile: Bundler.resolveFullPath(parentFile, match.groups.importFile),
        importedObjects: (objectImports?.replace("{", "").replace("}", "")
          .split(",").map(t => t.trim())),
      };
      if(defaultImport) Object.assign(mapResult, { defaultImportAlias: defaultImport[0] });
      return mapResult;
    });
  }

  private grabImportStatements (text : string) : ImportStatements {
    const ESImports : ImportStatements["ESImports"] = {
      static: Array.from(text.matchAll(/import (?<objects>.+) +from +\"(?<importFile>.*\/.*)\"/gm)),
      dynamic: Array.from(text.matchAll(/const (?<objects>.+)\s*=\s*(await)?\s*import\(\"(?<importFile>.*\/.*)\"\)/gm)),
    };

    const CJSImports = Array.from(text.matchAll(/const (?<objects>.+)\s*=\s*require\(\"(?<importFile>.*\/.*)\"\)/gm));

    return {
      ESImports,
      CJSImports,
    };
  }

  public static resolveFullPath (parentPath : string, childPath : string) : string {
    const dirsPath = Array.from(parentPath.matchAll(/(?<dirs>.+)\/([^\/]+)?/gm))[0]?.groups.dirs ?? "";
    const currentFileDirs = dirsPath.split("/");

    const directoryOffset = (childPath.match(/\.\.\//g) || []).length;
    const pathToDir = currentFileDirs.slice(0, currentFileDirs.length-directoryOffset).join("/");
    const filePath = childPath.replaceAll("../", "").replaceAll("./", "");
    return`${pathToDir}/${filePath}`;
  }

  private transformImports (imports : FileImportInfo[]) : void {
    for(const _import of imports) {
      const importsWithDefault = _import.importedObjects;
      if(_import.defaultImportAlias) importsWithDefault.push(`__default: ${_import.defaultImportAlias}`);

      const leftOperator = `const {${importsWithDefault.join(", ")}}`;
      const modulesFunction = `__modules["${_import.originFile}"]();`;
      const replaceString = `${leftOperator} = ${modulesFunction}`;
      this.filesList[_import.parentFile] =
        this.filesList[_import.parentFile].replace(_import.fullString, replaceString);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private transformExports () : void {
    for(const fileName in this.filesList) {
      if(fileName === this.entrypoint) continue;
      const exports = this.grabExportsStatements(this.filesList[fileName]);
      const exportInfo = this.buildExportInfo(exports);
      const exportsArray = [];
      for(const info of exportInfo) {
        if(info.isDefault) exportsArray.push(`__default: ${info.value}`);
        else if(info.name !== undefined) exportsArray.push(`${info.name}: ${info.value}`);
        else {
          const objExports = (info.value as string).match(/\{(?<objs>.+)\}/);
          if(objExports) exportsArray.push(objExports.groups.objs);
          else exportsArray.push(info.value);
        }
        this.filesList[fileName]=this.filesList[fileName].replace(info.fullString, "");
      }
      this.filesList[fileName] += `\nreturn { ${exportsArray.join(", ")} };\n`;
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private grabExportsStatements (text : string) : Array<RegExpMatchArray> {
    let str = text;
    const regexList = {
      classExports: /class (?<class_name>\w+) \{[\s\S]*\}/,
      functionExports: /((async )?function\s+(?<function_name>\w+)\s*\([\s\S]*?\)\s*)/,
      arrowFunctionExports: /(((async )?(\([\s\S]*?\))|.+)\s*=>\s*(\{[\s\S]*?\}))/,
      containerExports: /((\([\s\S]+?\))|(\{[\s\S]+?\})|(\[[\s\S]*?\]))/,
      basicExports: /\d+|\w+|(\`[\s\S]+?\`)|(\'.+?\')|(\".+?\")/,
    };

    const exports = [];
    for(const regexName in regexList) {
      const esReg = new RegExp("export (?<value>" + regexList[regexName].source + ")", "g");
      const cjsReg = new RegExp("module\\.exports\\s*=\\s*(?<value>" + regexList[regexName].source + ")", "g");

      const defaultMatches = [
        str.match(new RegExp("export default (?<value>" + regexList[regexName].source + ")")),
        str.match(new RegExp("exports\\.(?<name>\\w+)\\s*=\\s*(?<value>" + regexList[regexName].source + ")")),
      ].filter(match => match !== null);

      if(defaultMatches.length > 0) str = str.replace(defaultMatches[0][0], "");
      exports.push(...defaultMatches);

      const matches = Array.from(str.matchAll(esReg)) ?? Array.from(str.matchAll(cjsReg)) ?? [];

      if(regexName.toLowerCase().includes("function") && matches.length > 0) {
        matches.map(match => {
          const functionImplementation = Bundler.getNestedInChar(str.slice(match.index), "{");
          const valueStart = match[0].replace(match.groups.function_name, "").replace("export", "");
          match.groups.value = `${valueStart}${functionImplementation}`;
          match[0] += functionImplementation;
        });
      }

      matches.forEach(match => { str = str.replace(match[0], ""); });
      exports.push(...matches);
    }

    const result = exports.filter(expt => expt !== null);
    return result;
  }

  private static getNestedInChar (text : string, char : string) : string {
    const correspondingPair = { "{" : "}", "[" : "]", "(" : ")" };
    const firstPost = text.indexOf(char);
    let count = 1, index = firstPost + 1;
    while (count > 0 && index < text.length) {
      const currentChar = text.charAt(index);
      if(currentChar === char) count++;
      else if(currentChar === correspondingPair[char]) count--;
      index++;
    }

    return text.slice(firstPost, index);
  }

  private buildExportInfo (exports : Array<RegExpMatchArray>) : Array<ExportInfo> {
    return exports.map(exported => {
      const isDefault = exported.groups.defaultValue != undefined;
      const className = exported.groups["class_name"];
      const functionName = exported.groups["function_name"];
      const newExport : ExportInfo = {
        fullString: exported[0],
        value: exported.groups.value,
        name: exported.groups.name?.trim() ?? className?.trim() ?? functionName?.trim(),
        isDefault,
      };

      return newExport;
    });
  }

  private appendFiles (staticImports : Set<StaticImportInfo>) : void {
    let appendString = [...Array.from(staticImports), "const __modules = {}; \n"].join(";\n");
    for(const file in this.filesList) {
      if(file === this.entrypoint) continue;
      appendString += `__modules["${file}"] = (() => {\n${this.filesList[file]}});\n\n`;
    }
    this.filesList[this.entrypoint] = appendString + this.filesList[this.entrypoint];
  }

  private cleanup () : void {
    for(const fileName in this.filesList) if(fileName !== this.entrypoint) delete this.filesList[fileName];

    logger.debug(`[${this.identifier}] Original bundle contains ${this.filesList[this.entrypoint].length} characters`);
    this.replaceOutsideStrings(/\/\/.*?(\n|$)/gm, ""); // Remove single Line comments
    this.replaceOutsideStrings(/\/\*[\s\S]*\*\//gm, ""); // Remove multi Line comments
    this.replaceOutsideStrings(/(\s+)/g, " "), // Remove excess spaces and line breaks
    this.replaceOutsideStrings(/, ?([\]\}\)])/g, "$1"), // Remove Trailing commas
    this.replaceOutsideStrings(/ ?([;\}\]\)\{\[\(]) ?/g, "$1"), // Remove starting/ending block spaces
    this.replaceOutsideStrings(/ ?([,=+*-]) ?/g, "$1"), // Remove spaces adjacent to basic operators
    this.replaceOutsideStrings(/ ?([\:\>\<\?]) ?/g, "$1"), // Remove spaces adjacent to complex operators
    this.replaceOutsideStrings(/;{2,}/g, ";"), // Remove duplicate semi

    logger.debug(`[${this.identifier}] Final bundle contains ${this.filesList[this.entrypoint].length} characters`);
  }

  // eslint-disable-next-line max-lines-per-function
  private replaceOutsideStrings (regex : RegExp, replaceString : string) : void  {
    const stringLimits = Bundler.grabStringLimits(this.filesList[this.entrypoint]);
    let matches = Array.from(this.filesList[this.entrypoint].matchAll(regex));
    matches = matches.filter(match => {
      return stringLimits.every(limit => (match.index+match[0].length-1 < limit.start || match.index > limit.end));
    }).sort((matchA, matchB) => matchA.index - matchB.index);

    let replaceOffset = 0;
    matches.forEach((match) => {
      const replaceInfo = Array.from(replaceString.matchAll(/\$(?<N>\d)/g));
      const str = replaceInfo.reduce((acc, cur) => acc.replace("$"+cur.groups.N, match[cur.groups.N]), replaceString);
      this.filesList[this.entrypoint] =
        this.filesList[this.entrypoint].slice(0, match.index - replaceOffset) + str +
        this.filesList[this.entrypoint].slice(match.index+match[0].length - replaceOffset);
      replaceOffset += (match[0].length-str.length);
    });
  };

  // eslint-disable-next-line max-lines-per-function
  private static grabStringLimits (text : string) : Array<{start : number, end : number}> {
    let inStringChar = null;
    const stringLimits : Array<{start : number, end : number}> = [];
    const OrderedStringIdentifiers = ["\"", "\'", "\`"];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const previousChar = text[i-1];

      if (OrderedStringIdentifiers.includes(char)) {
        if(inStringChar) {
          if(previousChar === "\\") continue;
          const currentIdentifierPriority = OrderedStringIdentifiers.indexOf(inStringChar);
          const charPriority = OrderedStringIdentifiers.indexOf(char);
          if(charPriority < currentIdentifierPriority) continue;
          inStringChar = null;
          stringLimits[stringLimits.length-1].end = i;
        } else { inStringChar = char; stringLimits.push({ start: i, end: null });}
      }
    }
    return stringLimits;
  }

  public bundle () : string {
    const importList = this.grabImportList(this.entrypoint);
    logger.debug(`Package contains ${Object.keys(this.filesList).length} files`);
    this.stripUnimported(importList.fileImports);
    logger.debug(`Bundling ${Object.keys(this.filesList).length} files`);
    this.transformExports();
    this.transformImports(importList.fileImports);
    this.appendFiles(importList.staticImports);
    this.cleanup();
    return this.filesList[this.entrypoint];
  }
}
