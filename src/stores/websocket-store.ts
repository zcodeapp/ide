import { defineStore } from 'pinia';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

export const websocketStore = defineStore('websocket', {
  state: () => ({
    connected: false,
    connecting: false,
    error: false,
    host: '',
    port: '',
  }),
  getters: {
    isConnected: (state) => state.connected,
    isConnecting: (state) => state.connecting,
    haveError: (state) => state.error,
  },
  actions: {
    change(state: WebSocketStatus) {
        this.connected = state == WebSocketStatus.IS_CONNECTED
        this.connecting = state == WebSocketStatus.IS_CONNECTING
        this.error = state == WebSocketStatus.HAVE_ERROR
    },
    configure(host: string, port: string) {
        this.host = host;
        this.port = port;
    }
  },
});
