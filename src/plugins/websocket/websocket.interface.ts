export enum WebSocketStatus {
  NOT_CONNECTED = 0,
  IS_CONNECTING = 1,
  IS_CONNECTED = 2,
  HAVE_ERROR = 3
}

export interface IWebSocketOptions {
  host: string;
  port: string;
}

export interface IWebSocket {
  connect(options?: IWebSocketOptions, success?: (version: string) => void, error?: (error: Error) => void): Promise<void>;
  on(event: string, callback: (...args: any[]) => void): Promise<void>;
  emit(event: string, callback: (...args: any[]) => void): Promise<void>;
}