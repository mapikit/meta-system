import winston from "winston";
import { format } from "logform";
import * as LogInput from "./log-inputs";

const args = process.argv;

const winstonLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Stream({
      format: format.combine(
        format.timestamp(),
        format.json({ space: 2 }),
        format.colorize({ all : true }),
      ),
      stream: process.stdout,
      level: args.includes("debug") ? "debug":"info",
    }),
  ],
});

class MapikitLogger {
  private readonly logger = winstonLogger;
  public error (input : LogInput.Error) : void {this.logger.error(input);};
  public warn (input : LogInput.Warn) : void {this.logger.warn(input);};
  public info (input : LogInput.Info) : void {this.logger.info(input);};
  public verbose (input : LogInput.Verbose) : void {this.logger.verbose(input);};
  public debug (input : LogInput.Debug) : void {this.logger.debug(input);};
  public silly (input : LogInput.Silly) : void {this.logger.silly(input);};
}

export const logger = new MapikitLogger;
