/* eslint-disable max-lines-per-function */
import type { UnpackedFile } from "nethere/dist/types.js";
import type { ExportInfo, FileImportInfo, ImportInfo, ImportStatements, StaticImportInfo } from "./bundler-types.js";

export class Bundler {
  private filesList : Record<string, string>;

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
    const dirsPath = Array.from(parentPath.matchAll(/(?<dirs>.+)\/([^\/]+)/gm))[0].groups.dirs;
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
          exportsArray.push(objExports.groups.objs);
        }
        this.filesList[fileName]=this.filesList[fileName].replace(info.fullString, "");
      }
      this.filesList[fileName] += `return { ${exportsArray.join(", ")} };\n`;
    }
  }

  private grabExportsStatements (text : string) : Array<RegExpMatchArray> {
    const basicExports  = /\d+|\w+|(\`[\s\S]+?\`)|(\'.+?\')|(\".+?\")/;
    const containerExports = /((\([\s\S]+?\))|(\{[\s\S]+?\})|(\[[\s\S]*?\]))/;
    const arrowFunctionExports = /(((\([\s\S]*?\))|.+)\s*=>\s*(\{[\s\S]*?\}))/;
    const functionExports = /(function\s+.+\s*\([\s\S]*?\)\s*\{[\s\S]*?\})/;

    const fullRegex =
      [arrowFunctionExports.source,basicExports.source,containerExports.source,functionExports.source].join("|");

    const partialRegex =
      [basicExports.source, containerExports.source].join("|");

    const esRegex = new RegExp(
      "(export default (?<defaultValue>" + fullRegex +
      "))|(export (?<value>" + partialRegex + "))", "g");

    const cjsRegex = new RegExp(
      "(module\\.exports\\s*=\\s*(?<defaultValue>" + fullRegex +
      "))|(exports\\.(?<name>\\w+)\\s*=\\s*(?<value>" + fullRegex + "))", "g");

    const exports = [
      ...(Array.from(text.matchAll(esRegex)) ?? []),
      ...(Array.from(text.matchAll(cjsRegex)) ?? []),
    ];

    return [...exports ].filter(expt => expt !== null);
  }

  private buildExportInfo (exports : Array<RegExpMatchArray>) : Array<ExportInfo> {
    const result : Array<ExportInfo> = [];
    for(const exported of exports) {
      const isDefault = exported.groups.defaultValue != undefined;
      const newExport : ExportInfo = {
        fullString: exported[0],
        value: isDefault ? exported.groups.defaultValue : exported.groups.value,
        name: exported.groups.name?.trim(),
        isDefault,
      };
      result.push(newExport);
    }

    return result;
  }

  private appendFiles (staticImports : Set<StaticImportInfo>) : string {
    let appendString = [...Array.from(staticImports), "const __modules = {}; \n"].join(";\n");
    for(const file in this.filesList) {
      if(file === this.entrypoint) continue;
      appendString += `__modules["${file}"] = (() => {\n${this.filesList[file]}});\n\n`;
    }
    this.filesList[this.entrypoint] = appendString + this.filesList[this.entrypoint];
    // this.cleanup();
    return this.filesList[this.entrypoint];
  }

  private cleanup () : void {
    for(const file in this.filesList) if(file !== this.entrypoint) delete this.filesList[file];
    this.filesList[this.entrypoint] = this.filesList[this.entrypoint]
      .replaceAll(";;", ";").replaceAll("\n;", "") // Remove stranded ";"
      .replaceAll("\n", "").replaceAll("  ", " "); // Remove extra empty spaces and linebreaks
  }

  public bundle () : string {
    const importList = this.grabImportList(this.entrypoint);

    this.stripUnimported(importList.fileImports);
    this.transformExports();
    // fileList[entrypoint] = files.find(file => file.header.fileName === entrypoint).data.toString();
    this.transformImports(importList.fileImports);
    const final = this.appendFiles(importList.staticImports);
    return final;
  }
}
