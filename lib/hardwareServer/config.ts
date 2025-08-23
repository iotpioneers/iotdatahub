import type { Config } from "./types";

const config: Config = {
  iotPort: parseInt(process.env.IOT_PORT || "80", 10),
  iotSSLPort: parseInt(process.env.IOT_SSL_PORT || "443", 10),
  logLevel: process.env.LOG_LEVEL || "INFO",
  apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  apiPort: parseInt(process.env.API_PORT || "3001", 10),
};

export default config;
