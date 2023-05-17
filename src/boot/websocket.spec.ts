import { describe, expect, it, vi } from 'vitest';
import boot from './websocket';

const host = 'localhost';
const port = '8080';

vi.mock('io');
vi.mock('stores/websocket-store', () => {
  return {
    websocketStore: () => {
      return {
        configure: () => null,
        change: () => null,
        host,
        port
      }
    }
  };
});

describe('boot/websocket', () => {
  it('test boot', async () => {
    const globalProperties = {};
    await boot(
      {
        app: {
          use: (callback) => {
            callback.install({
              config: {
                globalProperties
              }
            });
          }
        }
      } as any
    );
    expect(globalProperties.$websocket.host).toBe(host);
    expect(globalProperties.$websocket.port).toBe(port);
    expect(globalProperties.$websocket.connect.name).toBe('connect');
    globalProperties.$websocket.connect();
  });
});
