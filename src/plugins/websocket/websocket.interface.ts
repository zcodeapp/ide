export enum WebSocketStatus {
  NOT_CONNECTED = 0,
  IS_CONNECTING = 1,
  IS_CONNECTED = 2,
  HAVE_ERROR = 3
}

export interface IWebSocket {
  connect(success?: () => void, error?: () => void): void;
}