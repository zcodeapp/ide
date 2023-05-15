import { defineStore } from 'pinia';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

export interface IWebSocketStoreStates {
  connected: boolean;
  connecting: boolean;
  error: boolean;
  host: string;
  port: string;
  version: string;
}

export interface IWebSocketStoreActions {
  change(state: WebSocketStatus): void;
  configure(host: string, port: string): void;
  changeVersion(version: string): void;
}

export const websocketStore = defineStore<'websocket', IWebSocketStoreStates, NonNullable<unknown>, IWebSocketStoreActions>('websocket', {
  state: () => ({
    connected: false,
    connecting: false,
    error: false,
    host: '',
    port: '',
    version: '',
  }),
  actions: {
    change(state: WebSocketStatus) {
      this.connected = state == WebSocketStatus.IS_CONNECTED
      this.connecting = state == WebSocketStatus.IS_CONNECTING
      this.error = state == WebSocketStatus.HAVE_ERROR
    },
    configure(host: string, port: string) {
      this.host = host;
      this.port = port;
    },
    changeVersion(version: string) {
      this.version = version;
    }
  },
});
