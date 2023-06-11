import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IWebSocketStoreActions,
  IWebSocketStoreStates,
  websocketStore,
} from './websocket-store';
import { Store } from 'pinia';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

vi.mock('pinia', () => {
  return {
    defineStore: (
      store: string,
      definations: {
        state: () => IWebSocketStoreStates;
        actions: IWebSocketStoreActions;
      }
    ) => {
      return () => {
        return {
          ...definations.state(),
          ...definations.actions,
        };
      };
    },
  };
});

describe('stores/websocket-store', () => {
  let instance: any;

  beforeEach(() => {
    instance = websocketStore();
  });

  it('test configure', () => {
    const host = 'localhost';
    const port = '8080';
    instance.configure(host, port);
    expect(instance.host).toBe(host);
    expect(instance.port).toBe(port);
  });

  it('test changeVersion', () => {
    const version = '0.0.1=test';
    expect(instance.version).toBe('');
    instance.changeVersion(version);
    expect(instance.version).toBe(version);
  });

  it('test change action to IS_CONNECTING', () => {
    instance.change(WebSocketStatus.IS_CONNECTING);
    expect(instance.connected).toBeFalsy();
    expect(instance.connecting).toBeTruthy();
    expect(instance.error).toBeFalsy();
  });

  it('test change action to IS_CONNECTED', () => {
    instance.change(WebSocketStatus.IS_CONNECTED);
    expect(instance.connected).toBeTruthy();
    expect(instance.connecting).toBeFalsy();
    expect(instance.error).toBeFalsy();
  });

  it('test change action to HAVE_ERROR', () => {
    instance.change(WebSocketStatus.HAVE_ERROR);
    expect(instance.connected).toBeFalsy();
    expect(instance.connecting).toBeFalsy();
    expect(instance.error).toBeTruthy();
  });
});
