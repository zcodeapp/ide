export enum WebSocketStatus {
  NOT_CONNECTED = 0,
  IS_CONNECTING = 1,
  IS_CONNECTED = 2,
  HAVE_ERROR = 3,
}

export interface IWebSocketOptions {
  host: string;
  port: string;
  key: string;
}

export interface IVersion {
  name: string;
  version: string;
  dependencies?: { [name: string]: string };
  devDependencies?: { [name: string]: string };
}

export interface IWebSocket {
  host: string;
  port: string;
  key: string;
  connect(
    options?: IWebSocketOptions,
    success?: (version: string) => void,
    error?: <T>(error: Error | T) => void
  ): Promise<void>;
  on<T>(event: string, callback: (...args: T[]) => void): Promise<void>;
  emit<T>(event: string, callback: (...args: T[]) => void): Promise<void>;
}

export interface WebSocketSystemError {
  context: string;
  message: string;
  params?: { [name: string]: string };
}
