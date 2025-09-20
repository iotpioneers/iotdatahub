"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    iotPort: parseInt(process.env.IOT_PORT || process.env.IOT_PORT_ALTERNATIVE || "8080", 10),
    iotSSLPort: parseInt(process.env.IOT_SSL_PORT || "8443", 10),
    logLevel: process.env.LOG_LEVEL || "INFO",
    apiBaseUrl: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL,
    apiPort: parseInt(process.env.API_PORT || "5000", 10),
};
exports.default = config;
