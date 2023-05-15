import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IWebSocket } from './websocket.interface';
import websocket from './websocket';
import { Socket, io } from 'socket.io-client';

vi.mock('io');

describe('example Component', () => {

  const host = '127.0.0.1';
  const port = '689';
  const nameTest = 'package/test';
  const versionTest = '1.0.0-test';

  const ioFactory: (uri: string) => Promise<Socket> = async (uri) => {
    const instance = io(uri);
    vi.spyOn(instance, 'on').mockImplementation((event, callback) => {
      if (event == 'connect') {
        callback()
      }
    });
    vi.spyOn(instance, 'emit').mockImplementation((event, callback) => {
      if (event == 'version') {
        callback({ name: nameTest, version: versionTest })
      }
    });
    return instance
  };

  let webSocket: IWebSocket;

  beforeEach(() => {
    webSocket = websocket(host, port, ioFactory);
  });

  it('test instance', () => {
    expect(webSocket.constructor.name).toBe('WebSocket');
  });

  it('test connect method without options', async () => {
    
    let versionResult = '';

    await webSocket.connect(
      undefined,
      (version) => {
        versionResult = version
      }
    );
    expect(versionResult).toBe(versionTest)
    expect(webSocket.host).toBe(host)
    expect(webSocket.port).toBe(port)
  });

  it('test connect method with options', async () => {
    
    const newHost = 'localhost';
    const newPort = '9000';
    let versionResult = '';

    await webSocket.connect(
      {
        host: newHost,
        port: newPort
      },
      (version) => {
        versionResult = version
      }
    );
    expect(versionResult).toBe(versionTest)
    expect(webSocket.host).toBe(newHost)
    expect(webSocket.port).toBe(newPort)
  });
});
