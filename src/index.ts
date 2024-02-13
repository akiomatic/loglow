/**
 * Enumeration for log colors with ANSI escape codes for terminal coloring.
 */
export enum LogColor {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
}

/**
 * Enumeration for log styles with ANSI escape codes to style terminal output.
 */
export enum LogStyle {
  Reset = "\x1b[0m",
  Bold = "\x1b[1m",
  Dim = "\x1b[2m",
  Italic = "\x1b[3m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
}

/**
 * Enumeration for identifying the type of log entry.
 */
enum DataType {
  Newline = "newline",
  Timestamp = "timestamp",
  Message = "message",
}

/**
 * Type definition for a log entry.
 * @property {DataType} type - The type of log entry.
 * @property {string | unknown[]} [data] - The content of the log entry, could be a message or other data types.
 * @property {LogColor | LogStyle} [color] - Optional color or style for the log entry.
 */
type LogEntry = {
  type: DataType;
  data?: string | unknown[];
  color?: LogColor | LogStyle;
};

/**
 * Class to create and manage a logger with support for colors, styles, and timestamps.
 */
export class Loglow {
  private data: LogEntry[] = [];

  /**
   * Adds a message log entry with optional styling.
   * @param {...unknown[]} messages - One or more messages or data to log.
   * @returns {this} The instance of Loglow for chaining.
   */
  public add(...messages: unknown[]): this {
    this.data.push({
      type: DataType.Message,
      data: messages,
    });
    return this;
  }

  /**
   * Adds a timestamp log entry with an optional color or style.
   * @param {LogColor | LogStyle} [color=LogStyle.Reset] - The color or style of the timestamp.
   * @returns {this} The instance of Loglow for chaining.
   */
  public addTimestamp(color: LogColor | LogStyle = LogStyle.Reset): this {
    this.data.push({
      type: DataType.Timestamp,
      color: color,
      data: new Date().toISOString(),
    });
    return this;
  }

  /**
   * Adds a newline log entry.
   * @returns {this} The instance of Loglow for chaining.
   */
  public addNewline(): this {
    this.data.push({ type: DataType.Newline });
    return this;
  }

  /**
   * Checks if a given value is a valid LogColor or LogStyle.
   * @private
   * @param {string} value - The value to check.
   * @returns {boolean} True if the value is a valid LogColor or LogStyle, false otherwise.
   */
  private isLogColorOrStyle(value: string): boolean {
    return Object.values({ ...LogColor, ...LogStyle }).includes(
      value as LogColor | LogStyle,
    );
  }

  /**
   * Prints the log entries to the console with appropriate formatting.
   */
  public print(): void {
    let output = "";
    this.data.forEach((item) => {
      switch (item.type) {
        case DataType.Newline:
          output += "\n";
          break;
        case DataType.Timestamp:
          output += `${item.color}${item.data}${LogStyle.Reset}`;
          break;
        case DataType.Message:
          let accMessage = "";
          let count = 0;

          if (typeof item.data === "string") {
            output += `${item.data}`;
            break;
          }

          item.data!.forEach((data) => {
            if (typeof data === "string" && this.isLogColorOrStyle(data)) {
              accMessage += `${data}`;
            } else {
              if (count > 0) {
                accMessage += " ";
              }
              accMessage += `${data}`;
              count++;
            }
          });

          output += `${accMessage}${LogStyle.Reset}`;

          if (item.data!.length > 0) {
            output += " ";
          }

          break;
      }
    });
    console.log(output);
  }
}
