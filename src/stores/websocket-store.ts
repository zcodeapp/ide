import { defineStore } from 'pinia';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

export interface IWebSocketStoreStates {
  connected: boolean;
  connecting: boolean;
  error: boolean;
  host: string;
  port: string;
  key: string;
  version: string;
}

export interface IWebSocketStoreActions {
  change(state: WebSocketStatus): void;
  configure(host: string, port: string, key: string): void;
  changeVersion(version: string): void;
  currentState(): WebSocketStatus;
}

export const websocketStore = defineStore<
  'websocket',
  IWebSocketStoreStates,
  NonNullable<unknown>,
  IWebSocketStoreActions
>('websocket', {
  state: () => ({
    connected: false,
    connecting: false,
    error: false,
    host: '',
    port: '',
    key: '',
    version: '',
  }),
  actions: {
    change(state: WebSocketStatus) {
      this.connected = state == WebSocketStatus.IS_CONNECTED;
      this.connecting = state == WebSocketStatus.IS_CONNECTING;
      this.error = state == WebSocketStatus.HAVE_ERROR;
    },
    configure(host: string, port: string, key: string) {
      this.host = host;
      this.port = port;
      this.key = key;
    },
    changeVersion(version: string) {
      this.version = version;
    },
    currentState(): WebSocketStatus {
      if (this.connected) return WebSocketStatus.IS_CONNECTED;
      if (this.connecting) return WebSocketStatus.IS_CONNECTING;
      if (this.error) return WebSocketStatus.HAVE_ERROR;
      return WebSocketStatus.NOT_CONNECTED;
    },
  },
});
