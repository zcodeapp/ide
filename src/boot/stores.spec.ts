import { describe, expect, it, vi } from 'vitest';
import boot from './stores';

const returnContent = 'test';

vi.mock('pinia');
vi.mock('../stores/websocket-store', () => {
  return {
    websocketStore: () => {
      return returnContent;
    }
  };
});

describe('boot/stores', () => {

  const app = {
    config: {
        globalProperties: {}
    }
};

  it('test stores', async () => {
    await boot(
      {
        app: {
          use: (callback) => {
            callback.install(app);
          }
        }
      } as any
    );

    expect(app.config.globalProperties.$websocketStore).toBe(returnContent);
  });
});
