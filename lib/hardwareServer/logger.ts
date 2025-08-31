import type { Logger, LogData } from "./types";

interface LogEntry extends LogData {
  timestamp: string;
  level: string;
  message: string;
}

class SimpleLogger implements Logger {
  log(level: string, message: string, data: LogData = {}): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    };
    console.log(JSON.stringify(entry));
  }

  info(message: string, data?: LogData): void {
    this.log("INFO", message, data);
  }

  debug(message: string, data?: LogData): void {
    this.log("DEBUG", message, data);
  }

  error(message: string, data?: LogData): void {
    this.log("ERROR", message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log("WARN", message, data);
  }
}

export default new SimpleLogger();
