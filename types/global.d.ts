import type { IoTDataHubTCPServer } from "@/lib/iotdatahub-server";
import type { IoTDataHubWebSocketServer } from "@/lib/websocket-server";

declare global {
  var iotdatahubServer: IoTDataHubTCPServer | undefined;
  var wsServer: IoTDataHubWebSocketServer | undefined;
}

declare module "ws" {
  export class WebSocket {
    constructor(address: string | URL, protocols?: string | string[]);
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;

    readyState: number;

    send(data: string | Buffer | ArrayBuffer | Buffer[]): void;
    close(code?: number, reason?: string): void;

    on(event: "open", listener: () => void): this;
    on(event: "close", listener: (code: number, reason: string) => void): this;
    on(event: "message", listener: (data: Buffer) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export class WebSocketServer {
    constructor(options: {
      server?: any;
      port?: number;
      path?: string;
      host?: string;
    });

    on(event: "connection", listener: (ws: WebSocket, req: any) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    close(callback?: () => void): void;
  }
}

declare module "cors" {
  interface CorsOptions {
    origin?:
      | boolean
      | string
      | RegExp
      | (string | RegExp)[]
      | ((
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }

  function cors(options?: CorsOptions): (req: any, res: any, next: any) => void;
  export = cors;
}

declare module "bcrypt" {
  export function hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string>;
  export function hashSync(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): string;
  export function compare(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
  export function compareSync(
    data: string | Buffer,
    encrypted: string,
  ): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
}

declare module "jsonwebtoken" {
  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    subject?: string;
    issuer?: string;
    jwtid?: string;
    mutatePayload?: boolean;
    noTimestamp?: boolean;
    header?: object;
    encoding?: string;
  }

  export interface VerifyOptions {
    algorithms?: string[];
    audience?: string | RegExp | (string | RegExp)[];
    clockTolerance?: number;
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    nonce?: string;
    subject?: string | string[];
    clockTimestamp?: number;
    maxAge?: string | number;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions,
  ): string;
  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions,
  ): any;
  export function decode(
    token: string,
    options?: { complete?: boolean; json?: boolean },
  ): any;
}

declare module "nodemailer" {
  export interface TransportOptions {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  export interface MailOptions {
    from?: string;
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    attachments?: any[];
  }

  export interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  export function createTransport(options: TransportOptions): Transporter;
}

declare module "mongodb" {
  export class MongoClient {
    constructor(url: string, options?: any);
    connect(): Promise<MongoClient>;
    db(dbName?: string): any;
    close(): Promise<void>;
  }

  export class ObjectId {
    constructor(id?: string | number | ObjectId);
    toString(): string;
  }
}

declare module "body-parser" {
  export function json(options?: any): (req: any, res: any, next: any) => void;
  export function urlencoded(
    options?: any,
  ): (req: any, res: any, next: any) => void;
  export function text(options?: any): (req: any, res: any, next: any) => void;
  export function raw(options?: any): (req: any, res: any, next: any) => void;
}

declare module "lodash" {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: any,
  ): T;
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: any,
  ): T;
  export function cloneDeep<T>(value: T): T;
  export function merge<T>(object: T, ...sources: any[]): T;
  export function pick<T, K extends keyof T>(
    object: T,
    ...props: K[]
  ): Pick<T, K>;
  export function omit<T, K extends keyof T>(
    object: T,
    ...props: K[]
  ): Omit<T, K>;
}

declare module "uuid" {
  export function v4(): string;
  export function v1(): string;
  export function v3(name: string, namespace: string): string;
  export function v5(name: string, namespace: string): string;
}
