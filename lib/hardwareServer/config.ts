import type { Config } from "./types";

const config: Config = {
  iotPort: parseInt(process.env.PORT || "7000", 10),
  iotSSLPort: parseInt(process.env.IOT_SSL_PORT || "8443", 10),
  logLevel: process.env.LOG_LEVEL || "INFO",
  apiBaseUrl: process.env.API_BASE_URL! || process.env.NEXT_PUBLIC_BASE_URL!,
  apiPort: parseInt(process.env.API_PORT || "5000", 10),
};

export default config;
