import { boot } from 'quasar/wrappers';
import WebSocket from 'src/plugins/websocket/websocket';
import { App } from 'vue';
import { websocketStore } from 'src/stores/websocket-store';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

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
        store,
        store.host,
        store.port,
      );
    }
  }

  vue.app.use(webSocket);
})