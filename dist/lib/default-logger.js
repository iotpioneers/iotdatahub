"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("@/config");
const logger_1 = require("@/lib/logger");
exports.logger = (0, logger_1.createLogger)({ level: config_1.config.logLevel });
