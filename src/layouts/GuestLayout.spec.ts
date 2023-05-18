import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { VueWrapper, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GuestLayout from './GuestLayout.vue';
import plugins from '../../test/vitest/plugins'

installQuasar();

describe('layouts/GuestLayout.vue', () => {

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(GuestLayout, {
      global: {
        plugins
      }
    });
  });

  it('Test header toolbar title', () => {
    expect(wrapper.find('.q-layout > .q-header > .q-toolbar > .q-toolbar__title').text()).toBe('ZCode App');
  });

  it('Test content is route view', () => {
    expect(wrapper.find('.q-layout > .q-page-container').html()).toBe('<div class="q-page-container" style="padding-top: 0px; padding-bottom: 0px;">\n  <!---->\n</div>');
  });

  it('Test footer', async () => {
    expect(wrapper.find('.q-layout > .q-footer > .q-toolbar').html()).toBeTruthy();
  });
});