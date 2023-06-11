import { describe, expect, it, vi } from 'vitest';
import boot from './i18n';

const callbackContent = 'test';
let callbackContentTest = '';

vi.mock('vue-i18n', () => {
  return {
    createI18n: () => {
      return {
        install: (callback) => {
          callbackContentTest = callback;
        },
      };
    },
  };
});

describe('boot/i18n', () => {
  it('test boot', async () => {
    await boot({
      app: {
        use: (callback) => {
          callback.install(callbackContent);
        },
      },
    } as any);

    expect(callbackContentTest).toBe(callbackContent);
  });
});
