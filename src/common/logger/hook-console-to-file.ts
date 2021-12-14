import { createWriteStream, existsSync, mkdirSync } from "fs";
import stripAnsi from "strip-ansi";

export function hookConsoleToFile (dirPath : string, firstLine ?: string) : void {
  if(!existsSync(dirPath)) mkdirSync(dirPath);
  const logFileName = `${dirPath}/${new Date().toISOString()}.log`;
  const fileStream = createWriteStream(logFileName);
  fileStream.write(firstLine);

  const logWriteStreams = [process.stderr, process.stdout];
  for(const stream of logWriteStreams) {
    const oldWrite = stream.write;
    stream.write = (string : string, callbackOrEncoding : any) : boolean => {
      oldWrite.apply(process.stdout, [string, callbackOrEncoding]);
      fileStream.write(stripAnsi(string), callbackOrEncoding);
      return true;
    };
  }
};
