"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_site_url_1 = require("@/lib/get-site-url");
const logger_1 = require("@/lib/logger");
exports.config = {
    site: {
        name: "IoTDataHub",
        description: "Scalable IoT data aggregation platform for enterprise-level device management and real-time monitoring",
        themeColor: "#090a0b",
        url: (0, get_site_url_1.getSiteURL)(),
    },
    logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL ??
        logger_1.LogLevel.ALL,
};
