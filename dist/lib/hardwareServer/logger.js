"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    warn(message, data) {
        this.log("WARN", message, data);
    }
}
exports.default = new SimpleLogger();
