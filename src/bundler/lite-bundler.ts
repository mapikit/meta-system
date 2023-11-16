/* eslint-disable max-lines-per-function */
import type { UnpackedFile } from "nethere/dist/types.js";
import type { ExportInfo, FileImportInfo, ImportInfo, ImportStatements, StaticImportInfo } from "./bundler-types.js";
// import { unpkgData } from "../bootstrap/collect-strategies/temp-data.js";

export class Bundler {
  public filesList : Record<string, string>;

  constructor (
    private entrypoint : string,
    downloadedData : Array<UnpackedFile>,
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
      static: Array.from(text.matchAll(/import (?<objects>.+) from \"(?<importFile>.*\/.*)\"/gm)), //Static imports
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
      if(_import.defaultImportAlias) {
        const defaultString = `__default: ${_import.defaultImportAlias}`;
        importsWithDefault.push(defaultString);
      }
      const leftOperator = `const {${importsWithDefault.join(", ")}}`;
      const modulesFunction = `__modules["${_import.originFile}"]();`;
      const replaceString = `${leftOperator} = ${modulesFunction}`;
      this.filesList[_import.parentFile] =
        this.filesList[_import.parentFile].replace(_import.fullString, replaceString);
    }
  }

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

      const matches = Array.from(str.matchAll(esReg)) ?? Array.from(str.matchAll(cjsReg)) ?? [];

      if(regexName.toLowerCase().includes("function") && matches.length > 0) {
        matches.map(match => {
          const functionImplementation = Bundler.getNestedInChar(str.slice(match.index), "{");
          const valueStart = match[0].replace(match.groups.function_name, "").replace("export", "");
          match.groups.value = `${valueStart}${functionImplementation}`;
          match[0] += functionImplementation;
        });
      }

      exports.push(...matches);
      if(matches.length > 0) str = str.replace(matches[0][0], "");

      exports.push(str.match(new RegExp("export default (?<value>" + regexList[regexName].source + ")")));
      exports.push(str.match(new RegExp("exports\\.(?<name>\\w+)\\s*=\\s*(?<value>" +
        regexList[regexName].source + ")")));
    }

    const result = exports.filter(expt => expt !== null);
    return result;
  }

  public static getNestedInChar (text : string, char : string) : string {
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
    const result : Array<ExportInfo> = [];
    for(const exported of exports) {
      const isDefault = exported.groups.defaultValue != undefined;
      const className = exported.groups["class_name"];
      const functionName = exported.groups["function_name"];
      const newExport : ExportInfo = {
        fullString: exported[0],
        value: exported.groups.value,
        name: exported.groups.name?.trim() ?? className?.trim() ?? functionName?.trim(),
        isDefault,
      };

      result.push(newExport);
    }

    return result;
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
    for(const file in this.filesList) if(file !== this.entrypoint) delete this.filesList[file];
    this.removeComments();
    this.filesList[this.entrypoint] = this.filesList[this.entrypoint]
      .replaceAll(/;\s*\n*;/g, ";").replaceAll("\n;", "") // Remove stranded ";"
      .replaceAll("\n", "").replaceAll(/\s+/g, " ") // Remove extra empty spaces and linebreaks
      .replaceAll(/,\s*([\}\]])/g, "$1") // Remove trailing commas
      .replaceAll(/\}\s+\}/g, "}}"); //Remove spaces between curly
    // TODO IMPORTANT! All of this cleanup must be string-aware. Currently will mess up strings!
    // Solution suggestion : Based of removeComments method, create a method that finds comments
    // limits returns an Array<{start: string, end: string}> and replaces the above only in code (ignore slices)
    // within any of the returned limits
  }

  public removeComments () : void {
    let inString = false;
    let singleComment = false;
    let multiComment = false;
    let commentStart = -1;

    for (let i = 0; i < this.filesList[this.entrypoint].length; i++) {
      const char = this.filesList[this.entrypoint].charAt(i);
      const nextChar = this.filesList[this.entrypoint].charAt(i+1);
      const str = this.filesList[this.entrypoint];

      if (["\"", "\'", "\`"].includes(char)) inString = !inString;
      else if (!inString) {
        if (char === "/") {
          if(nextChar === "/") { singleComment = true; commentStart = i; }
          else if(nextChar === "*") { multiComment = true; commentStart = i; }
        } else if (char === "*" && nextChar === "/" && multiComment) {
          multiComment = false;
          this.filesList[this.entrypoint] = str.slice(0, commentStart) + str.slice(i+2); //Includes nextChar
          i = commentStart - 1; // Compensate for removed string
        } else if (singleComment && (char === "\n" || i === str.length-1)) {
          singleComment = false;
          this.filesList[this.entrypoint] = str.slice(0, commentStart) + str.slice(i+1);
          i = commentStart - 1; // Compensate for removed string
        }
      }
    }
  }

  public bundle () : string {
    const importList = this.grabImportList(this.entrypoint);

    this.stripUnimported(importList.fileImports);
    this.transformExports();
    this.transformImports(importList.fileImports);
    this.appendFiles(importList.staticImports);
    this.cleanup();
    return this.filesList[this.entrypoint];
  }
}
