import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/server/configure',
  },
  {
    path: '/server',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '', redirect: '/' },
      {
        path: 'configure',
        component: () => import('pages/ServerConfigurePage.vue'),
      },
      {
        path: 'logout',
        component: () => import('pages/ServerLogoutPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
