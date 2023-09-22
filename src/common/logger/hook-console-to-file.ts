import stripAnsi from "strip-ansi";

/**
 * Creates a new log file in the given dir with the current date. All logs will also
 * be written in the file.
 *
 * @param dirPath The path containing the log files
 */
export async function hookConsoleToFile (dirPath : string) : Promise<void> {
  const { createWriteStream, existsSync, mkdirSync } = await import("fs");
  if(!existsSync(dirPath)) mkdirSync(dirPath);
  const logFileName = `${dirPath}/${new Date().toISOString()}.log`;
  const fileStream = createWriteStream(logFileName);

  const consoleWriteStreams = [process.stderr, process.stdout];
  for(const stream of consoleWriteStreams) {
    const oldWrite = stream.write;
    stream.write = (string : string, callbackOrEncoding) : boolean => {
      oldWrite.apply(process.stdout, [string, callbackOrEncoding]);
      fileStream.write(stripAnsi(string), callbackOrEncoding);
      return true;
    };
  }
};
