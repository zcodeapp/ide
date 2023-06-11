import { createI18n } from 'vue-i18n';
import messages from '../../src/i18n';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from '../../src/router/routes';

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  globalInjection: true,
  messages,
});

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createWebHashHistory(),
});

export default [i18n, router];
