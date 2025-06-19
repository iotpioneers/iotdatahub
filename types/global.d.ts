import { IoTDataHubTCPServer } from "@/lib/iotdatahub-server";
import { IoTDataHubWebSocketServer } from "@/lib/websocket-server";

declare global {
  var iotdatahubServer: IoTDataHubTCPServer | undefined;
  var wsServer: IoTDataHubWebSocketServer | undefined;
}
