declare module "ws" {
  import { EventEmitter } from "events"
  import type { IncomingMessage } from "http"
  import type { Socket } from "net"
  import type { URL } from "url"

  export class WebSocket extends EventEmitter {
    static readonly CONNECTING: 0
    static readonly OPEN: 1
    static readonly CLOSING: 2
    static readonly CLOSED: 3

    readonly CONNECTING: 0
    readonly OPEN: 1
    readonly CLOSING: 2
    readonly CLOSED: 3

    readonly readyState: number
    readonly url: string
    readonly protocol: string

    constructor(address: string | URL, protocols?: string | string[], options?: any)

    close(code?: number, reason?: string): void
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void
    send(data: any, cb?: (err?: Error) => void): void
    send(data: any, options: any, cb?: (err?: Error) => void): void
    terminate(): void

    on(event: "close", listener: (code: number, reason: string) => void): this
    on(event: "error", listener: (err: Error) => void): this
    on(event: "message", listener: (data: any) => void): this
    on(event: "open", listener: () => void): this
    on(event: "ping" | "pong", listener: (data: Buffer) => void): this
    on(event: string | symbol, listener: (...args: any[]) => void): this
  }

  export class WebSocketServer extends EventEmitter {
    readonly clients: Set<WebSocket>

    constructor(options?: {
      host?: string
      port?: number
      server?: any
      verifyClient?: any
      handleProtocols?: any
      path?: string
      noServer?: boolean
      clientTracking?: boolean
      perMessageDeflate?: boolean | any
      maxPayload?: number
    })

    close(cb?: (err?: Error) => void): void
    handleUpgrade(
      request: IncomingMessage,
      socket: Socket,
      upgradeHead: Buffer,
      callback: (client: WebSocket, request: IncomingMessage) => void,
    ): void
    shouldHandle(request: IncomingMessage): boolean

    on(event: "connection", listener: (socket: WebSocket, request: IncomingMessage) => void): this
    on(event: "error", listener: (err: Error) => void): this
    on(event: "headers", listener: (headers: string[], request: IncomingMessage) => void): this
    on(event: "listening", listener: () => void): this
    on(event: string | symbol, listener: (...args: any[]) => void): this
  }
}
