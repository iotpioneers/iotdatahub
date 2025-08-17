module.exports = {
  iotPort: process.env.IOT_PORT || 80,
  iotSSLPort: process.env.IOT_SSL_PORT || 443,
  logLevel: process.env.LOG_LEVEL || "INFO",
  apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  apiPort: process.env.API_PORT || 3001,
};
