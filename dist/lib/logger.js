"use strict";
/* eslint-disable no-console -- Allow */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLogger = exports.Logger = exports.LogLevel = void 0;
exports.createLogger = createLogger;
// NOTE: A tracking system such as Sentry should replace the console
exports.LogLevel = {
    NONE: "NONE",
    ERROR: "ERROR",
    WARN: "WARN",
    DEBUG: "DEBUG",
    ALL: "ALL",
};
const LogLevelNumber = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    DEBUG: 3,
    ALL: 4,
};
class Logger {
    constructor({ prefix = "", level = exports.LogLevel.ALL, showLevel = true, }) {
        this.debug = (...args) => {
            if (this.canWrite(exports.LogLevel.DEBUG)) {
                this.write(exports.LogLevel.DEBUG, ...args);
            }
        };
        this.warn = (...args) => {
            if (this.canWrite(exports.LogLevel.WARN)) {
                this.write(exports.LogLevel.WARN, ...args);
            }
        };
        this.error = (...args) => {
            if (this.canWrite(exports.LogLevel.ERROR)) {
                this.write(exports.LogLevel.ERROR, ...args);
            }
        };
        this.prefix = prefix;
        this.level = level;
        this.levelNumber = LogLevelNumber[this.level];
        this.showLevel = showLevel;
    }
    canWrite(level) {
        return this.levelNumber >= LogLevelNumber[level];
    }
    write(level, ...args) {
        let prefix = this.prefix;
        if (this.showLevel) {
            prefix = `- ${level} ${prefix}`;
        }
        if (level === exports.LogLevel.ERROR) {
            throw new Error(prefix);
        }
        else {
            throw new Error(prefix);
        }
    }
}
exports.Logger = Logger;
// This can be extended to create context specific logger (Server Action, Router Handler, etc.)
// to add context information (IP, User-Agent, timestamp, etc.)
function createLogger({ prefix, level } = {}) {
    return new Logger({ prefix, level });
}
/**
 * Simple logger implementation with masking for sensitive data
 */
class SimpleLogger {
    log(level, message, data = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...data,
        };
        console.log(JSON.stringify(entry));
    }
    info(message, data) {
        this.log("INFO", message, data);
    }
    debug(message, data) {
        this.log("DEBUG", message, data);
    }
    error(message, data) {
        this.log("ERROR", message, data);
    }
}
exports.SimpleLogger = SimpleLogger;
