import { iotdatahubServerManager } from "@/lib/iotdatahub-server-manager";

async function startIoTDataHubServers() {
  try {
    console.log("Starting IoTDataHub servers...");
    await iotdatahubServerManager.initialize();
    console.log("IoTDataHub servers started successfully");
  } catch (error) {
    console.error("Failed to start IoTDataHub servers:", error);
  }
}

// Start servers if this script is run directly
if (require.main === module) {
  startIoTDataHubServers();
}

export { startIoTDataHubServers };
