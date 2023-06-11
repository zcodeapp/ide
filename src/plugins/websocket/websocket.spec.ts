import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IWebSocket } from './websocket.interface';
import websocket, { WebSocket } from './websocket';
import { Socket, io } from 'socket.io-client';

vi.mock('io');

describe('plugins/websocket/websocket', () => {
  const host = '127.0.0.1';
  const port = '689';
  const nameTest = 'package/test';
  const versionTest = '1.0.0-test';
  let webSocket: IWebSocket;

  const ioFactory: (uri: string) => Promise<Socket> = async (uri) => {
    const instance = io(uri);
    vi.spyOn(instance, 'on').mockImplementation((event, callback) => {
      if (event == 'connect') {
        callback();
      }
    });
    vi.spyOn(instance, 'emit').mockImplementation((event, callback) => {
      if (event == 'version') {
        callback({ name: nameTest, version: versionTest });
      }
    });
    return instance;
  };

  beforeEach(() => {
    webSocket = websocket(host, port, ioFactory);
  });

  it('test instance', () => {
    expect(webSocket.constructor.name).toBe('WebSocket');
  });

  it('test connect method without options', async () => {
    let versionResult = '';

    await webSocket.connect(undefined, (version) => {
      versionResult = version;
    });
    expect(versionResult).toBe(versionTest);
    expect(webSocket.host).toBe(host);
    expect(webSocket.port).toBe(port);
  });

  it('test get singleton instance with no configuration', async () => {
    const _webSocket = websocket();
    await _webSocket.connect(undefined, undefined);
    expect(_webSocket.host).toBe(host);
    expect(_webSocket.port).toBe(port);
  });

  it('test get singleton instance with new configuration', async () => {
    const newHost = 'localhost';
    const newPort = '9000';
    const _webSocket = websocket(newHost, newPort, ioFactory);
    await _webSocket.connect(undefined, undefined);
    expect(_webSocket.host).toBe(host);
    expect(_webSocket.port).toBe(port);
  });

  it('test connect method with options', async () => {
    const newHost = 'localhost';
    const newPort = '9000';
    let versionResult = '';

    await webSocket.connect(
      {
        host: newHost,
        port: newPort,
      },
      (version) => {
        versionResult = version;
      }
    );
    expect(versionResult).toBe(versionTest);
    expect(webSocket.host).toBe(newHost);
    expect(webSocket.port).toBe(newPort);
  });

  it('test try get first singleton instance without host', () => {
    WebSocket.instance = undefined;

    const test = () => {
      return new Promise((resolve, reject) => {
        try {
          const instance = websocket(undefined, port, ioFactory);
          resolve('success');
        } catch (e: any) {
          reject(e.message);
        }
      });
    };

    expect(test()).resolves.toBe('success');
  });

  it('test try get first singleton instance without port', () => {
    WebSocket.instance = undefined;

    const test = () => {
      return new Promise((resolve, reject) => {
        try {
          const instance = websocket(host, undefined, ioFactory);
          resolve('success');
        } catch (e: any) {
          reject(e.message);
        }
      });
    };

    expect(test()).resolves.toBe('success');
  });

  it('test try get first singleton instance without ioFactory', () => {
    WebSocket.instance = undefined;

    const test = () => {
      return new Promise((resolve, reject) => {
        try {
          const instance = websocket(host, port, undefined);
          resolve('success');
        } catch (e: any) {
          reject(e.message);
        }
      });
    };

    expect(test()).rejects.toBe(
      'To get websocket instance configure ioFactory'
    );
  });

  it('test connect error and close connection', async () => {
    const errorMessage = 'error';
    let errorMessageTest = '';
    let closed = false;

    const _ioFactory: (uri: string) => Promise<Socket> = async (uri) => {
      const instance = io(uri);
      vi.spyOn(instance, 'on').mockImplementation((event, callback) => {
        if (event == 'connect_error') {
          callback(new Error(errorMessage));
        }
      });
      vi.spyOn(instance, 'close').mockImplementation(() => {
        closed = true;
      });
      return instance;
    };
    const _webSocket = new WebSocket(host, port, _ioFactory);

    const _error = (error) => {
      errorMessageTest = error.message;
    };

    await _webSocket.connect(undefined, undefined, _error);

    expect(errorMessageTest).toBe(errorMessage);
    expect(closed).toBe(true);
  });

  it('test reconnect error and close connection', async () => {
    const errorMessage = 'error';
    let errorMessageTest = '';
    let closed = false;

    const _ioFactory: (uri: string) => Promise<Socket> = async (uri) => {
      const instance = io(uri);
      vi.spyOn(instance, 'on').mockImplementation((event, callback) => {
        if (event == 'reconnect_error') {
          callback(new Error(errorMessage));
        }
      });
      vi.spyOn(instance, 'close').mockImplementation(() => {
        closed = true;
      });
      return instance;
    };
    const _webSocket = new WebSocket(host, port, _ioFactory);

    const _error = (error) => {
      errorMessageTest = error.message;
    };

    await _webSocket.connect(undefined, undefined, _error);
    expect(errorMessageTest).toBe(errorMessage);
    expect(closed).toBe(true);
  });

  it('test error and not close connection', async () => {
    const errorMessage = 'error';
    let errorMessageTest = '';
    let closed = false;

    const _ioFactory: (uri: string) => Promise<Socket> = async (uri) => {
      const instance = io(uri);
      vi.spyOn(instance, 'on').mockImplementation((event, callback) => {
        if (event == 'error') {
          callback(new Error(errorMessage));
        }
      });
      vi.spyOn(instance, 'close').mockImplementation(() => {
        closed = true;
      });
      return instance;
    };
    const _webSocket = new WebSocket(host, port, _ioFactory);

    const _error = (error) => {
      errorMessageTest = error.message;
    };

    await _webSocket.connect(undefined, undefined, _error);
    expect(errorMessageTest).toBe(errorMessage);
    expect(closed).toBe(false);
  });
});
