import { boot } from 'quasar/wrappers';
import WebSocket from '../plugins/websocket/websocket';
import { App } from 'vue';
import { websocketStore } from '../stores/websocket-store';
import { WebSocketStatus } from '../plugins/websocket/websocket.interface';
import { io } from 'socket.io-client';

export default boot(async (vue) => {

  const webSocket = {
    install: (app: App) => {
      const store = websocketStore();
      store.change(WebSocketStatus.NOT_CONNECTED);
      store.configure(
        import.meta.env.VITE_SERVER_ADDRESS,
        import.meta.env.VITE_SERVER_PORT
      );
      app.config.globalProperties.$websocket = WebSocket(
        store.host,
        store.port,
        (uri) => {
          return io(uri);
        }
      );
    }
  }

  vue.app.use(webSocket);
})