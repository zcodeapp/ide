import { RouteRecordRaw } from 'vue-router';
import { App } from 'vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/server/configure'
  },
  {
    path: '/server',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '', redirect: '/' },
      {
        path: 'configure',
        component: () => import('pages/ServerConfigurePage.vue')
      }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
