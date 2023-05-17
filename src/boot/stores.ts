import { boot } from 'quasar/wrappers';
import { App } from 'vue';
import { websocketStore } from '../stores/websocket-store';

export default boot(async (vue) => {

  const _websocketStore = {
    install: (app: App) => {
      app.config.globalProperties.$websocketStore = websocketStore();
    }
  }

  vue.app.use(_websocketStore);
});