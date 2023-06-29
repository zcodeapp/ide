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
        import.meta.env.VITE_SERVER_PORT,
        import.meta.env.VITE_SERVER_KEY
      );
      app.config.globalProperties.$websocket = WebSocket(
        store.host,
        store.port,
        store.key,
        async (uri, key) => {
          return io(uri, {
            auth: {
              key,
            },
            timeout: import.meta.env.VITE_SERVER_TIMEOUT || 5000,
          });
        }
      );
    },
  };

  vue.app.use(webSocket);
});
