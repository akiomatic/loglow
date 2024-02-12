import chalk, { ForegroundColor } from "chalk";
import * as fs from "fs";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

interface IConfig {
  format: string;
  colors: {
    source: string;
    info: string;
    error: string;
    warn: string;
    debug: string;
  };
}

const enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

class Loglow {
  private static config: IConfig = {
    format: "{timestamp} {source} [{level}] {messages}",
    colors: {
      source: "gray",
      info: "reset",
      error: "red",
      warn: "yellow",
      debug: "cyan",
    },
  };

  static {
    try {
      const data = fs.readFileSync("lgconfig.json", "utf-8");
      const config = JSON.parse(data);

      Loglow.config = { ...Loglow.config, ...config };
    } catch {}
  }

  private static _isValidColor(color: string): color is typeof ForegroundColor {
    return chalk[color as typeof ForegroundColor] !== undefined;
  }
  private static _log(logLevel: LogLevel, messages: string[]): void {
    const { fileName } = Loglow._getSource();
    let formattedMessage: string = Loglow.config.format;
    const sourceColor: string = Loglow.config.colors.source;
    const logLevelColor: string = Loglow.config.colors?.[logLevel] ?? "reset";

    if (formattedMessage.includes("{source}")) {
      const colorFunction = this._isValidColor(sourceColor)
        ? chalk[sourceColor]
        : chalk.reset;
      formattedMessage = formattedMessage.replace(
        "{source}",
        colorFunction(fileName),
      );
    }

    if (
      formattedMessage.includes("{level}") ||
      formattedMessage.includes("{messages}")
    ) {
      const colorFunction = this._isValidColor(logLevelColor)
        ? chalk[logLevelColor]
        : chalk.reset;
      formattedMessage = formattedMessage
        .replace("{level}", colorFunction(logLevel.toUpperCase()))
        .replace("{messages}", colorFunction(messages.join(" ")));
    }

    formattedMessage = formattedMessage.replace(
      "{timestamp}",
      new Date().toISOString(),
    );

    switch (logLevel) {
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  private static _getSource(): { fileName: string } {
    const err: Error = new Error();
    const stack: string | undefined = err.stack;
    const stackLines: string[] = stack ? stack.split("\n") : [];

    const internalCallsToSkip = ["Loglow._log", "Loglow._getSource", "Error"];

    let relevantLine = stackLines.find((line) => {
      return !internalCallsToSkip.some((internalCall) =>
        line.includes(internalCall),
      );
    });

    if (!relevantLine) {
      return { fileName: "unknown" };
    }

    const match =
      /at\s+(?:.*\s+)?(?:\((?:.*\/)?(.*?):\d+:\d+\)|((?:.*\/)?.*?):\d+:\d+)/.exec(
        relevantLine,
      );
    const fileName = match ? match[1] || match[2] : "unknown";

    return {
      fileName: fileName.split("/").pop() || "unknown",
    };
  }

  static info(...messages: string[]): void {
    Loglow._log(LogLevel.INFO, messages);
  }

  static warn(...messages: string[]): void {
    Loglow._log(LogLevel.WARN, messages);
  }

  static error(...messages: string[]): void {
    Loglow._log(LogLevel.ERROR, messages);
  }

  static debug(...messages: string[]): void {
    Loglow._log(LogLevel.DEBUG, messages);
  }
}

export default Loglow;
