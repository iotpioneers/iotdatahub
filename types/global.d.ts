declare module "express";
declare module "cors";
declare module "nodemailer";
declare module "react-grid-layout";
declare module "react-slick";
declare module "react-grid-layout/css/styles.css";
declare module "react-resizable/css/styles.css";

import { IoTDataHubTCPServer } from "@/lib/iotdatahub-server";
import { IoTDataHubWebSocketServer } from "@/lib/websocket-server";

declare global {
  var iotdatahubServer: IoTDataHubTCPServer | undefined;
  var wsServer: IoTDataHubWebSocketServer | undefined;
}
