import { describe, expect, it, vi } from 'vitest';
import routes from './routes';

vi.mock('vue-i18n');
vi.mock('layouts/GuestLayout.vue');
vi.mock('vue-router');
vi.mock('pinia', () => {
  return {
    storeToRefs: (input) => {
      return input;
    },
  };
});

describe('router/routes', () => {
  it('test root page redirect to server configure', () => {
    const route = routes.find((x) => x.path == '/');
    expect(route?.path).toBe('/');
    expect(route?.redirect).toBe('/server/configure');
  });

  it('test server route has guest layout', async () => {
    const route = routes.find((x) => x.path == '/server');
    if (!route?.component) {
      throw new Error('not have component to test');
    }
    const component = await route.component.call();
    expect(component.default.name).toBe('GuestLayout');
  });

  it('test server route has children root sending to root page', async () => {
    const route = routes.find((x) => x.path == '/server');
    if (!route?.children) {
      throw new Error('not have children to test');
    }
    const children = route.children.find((x) => x.path == '');
    expect(children?.redirect).toBe('/');
  });

  it('test server route has children configure page using component ServerConfigurePage', async () => {
    const route = routes.find((x) => x.path == '/server');
    if (!route?.children) {
      throw new Error('not have children to test');
    }
    const children = route.children.find((x) => x.path == 'configure');
    if (!children?.component) {
      throw new Error('not have children component to test');
    }
    const component = await children.component.call();
    expect(component.default.name).toBe('ServerConfigurePage');
  });

  it('test server route to catch all pages 404', async () => {
    const route = routes.find((x) => x.path == '/:catchAll(.*)*');
    if (!route?.component) {
      throw new Error('not have component to test');
    }
    const component = await route.component.call();
    expect(component.default.name).toBe('ErrorNotFound');
  });
});
