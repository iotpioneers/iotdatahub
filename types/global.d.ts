import type { IoTDataHubTCPServer } from "@/lib/iotdatahub-server"
import type { IoTDataHubWebSocketServer } from "@/lib/websocket-server"

declare global {
  var iotdatahubServer: IoTDataHubTCPServer | undefined
  var wsServer: IoTDataHubWebSocketServer | undefined
}

declare module "ws" {
  export * from "ws"
}

declare module "cors" {
  export * from "cors"
}

declare module "bcrypt" {
  export * from "bcrypt"
}

declare module "jsonwebtoken" {
  export * from "jsonwebtoken"
}

declare module "nodemailer" {
  export * from "nodemailer"
}

declare module "mongodb" {
  export * from "mongodb"
}

declare module "body-parser" {
  export * from "body-parser"
}

declare module "lodash" {
  export * from "lodash"
}

declare module "uuid" {
  export * from "uuid"
}

declare module "*" {
  const content: any
  export default content
}
