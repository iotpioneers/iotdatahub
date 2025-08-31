"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const config = {
    iotPort: parseInt(process.env.IOT_PORT || "80", 10),
    iotSSLPort: parseInt(process.env.IOT_SSL_PORT || "443", 10),
    logLevel: process.env.LOG_LEVEL || "INFO",
    apiBaseUrl: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL,
    apiPort: parseInt(process.env.API_PORT || "3001", 10),
};
exports.default = config;
