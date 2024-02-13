export enum LogColor {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
}

export enum LogStyle {
  Reset = "\x1b[0m",
  Bold = "\x1b[1m",
  Dim = "\x1b[2m",
  Italic = "\x1b[3m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
}

enum DataType {
  Newline = "newline",
  Timestamp = "timestamp",
  Message = "message",
}

type LogEntry = {
  type: DataType;
  data?: string | unknown[];
  color?: LogColor | LogStyle;
};

export class Loglow {
  private data: LogEntry[] = [];

  public add(...messages: unknown[]): this {
    this.data.push({
      type: DataType.Message,
      data: messages,
    });
    return this;
  }

  public addTimestamp(color: LogColor | LogStyle = LogStyle.Reset): this {
    this.data.push({
      type: DataType.Timestamp,
      color: color,
      data: new Date().toISOString(),
    });
    return this;
  }

  public addNewline(): this {
    this.data.push({ type: DataType.Newline });
    return this;
  }

  private isLogColorOrStyle(value: string): boolean {
    return Object.values({ ...LogColor, ...LogStyle }).includes(
      value as LogColor | LogStyle,
    );
  }

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
              console.log("data", data);
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
