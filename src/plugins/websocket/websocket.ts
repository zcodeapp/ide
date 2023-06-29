import {
  IVersion,
  IWebSocket,
  IWebSocketOptions,
  WebSocketSystemError,
} from './websocket.interface';
import { Socket } from 'socket.io-client';

export class WebSocket implements IWebSocket {
  private instanceIo?: Socket;
  static instance?: IWebSocket;

  constructor(
    public host: string,
    public port: string,
    public key: string,
    private ioFactory: (uri: string, key: string) => Promise<Socket>
  ) {}

  static getInstance(
    host?: string,
    port?: string,
    key?: string,
    ioFactory?: (uri: string, key: string) => Promise<Socket>
  ): IWebSocket {
    if (!WebSocket.instance) {
      if (!ioFactory) {
        throw new Error('To get websocket instance configure ioFactory');
      }
      WebSocket.instance = new WebSocket(
        host || '',
        port || '',
        key || '',
        ioFactory
      );
    }
    return WebSocket.instance;
  }

  async connect(
    options?: IWebSocketOptions,
    success?: (version: string) => void,
    error?: <T>(error: Error | T) => void
  ): Promise<void> {
    if (options) {
      const { host, port, key } = options;

      this.host = host;
      this.port = port;
      this.key = key;
    }

    await this.mountIo();

    await this.on('system_error', async (e: string) => {
      if (error) {
        const _error = JSON.parse(e) as WebSocketSystemError;
        error(_error);
      }
    });

    await this.on('connect', async () => {
      await this.emit('version', (v: IVersion) => {
        if (success) success(v.version);
      });
    });
    await this.on('connect_error', async (e: Error) => {
      await this.close();
      if (error) error(e);
    });
    await this.on('reconnect_error', async (e: Error) => {
      await this.close();
      if (error) error(e);
    });
    await this.on('error', (e: Error) => {
      if (error) error(e);
    });
  }

  async on<T>(event: string, callback: (...args: T[]) => void): Promise<void> {
    if (this.instanceIo) {
      this.instanceIo.on(event, callback);
    }
  }

  async emit<T, P>(
    event: string,
    callback: (...args: T[]) => void,
    params?: P
  ): Promise<void> {
    if (this.instanceIo) {
      this.instanceIo.emit(event, params || {}, callback);
    }
  }

  async close(): Promise<void> {
    if (this.instanceIo) {
      this.instanceIo.close();
      this.instanceIo = undefined;
    }
  }

  private async mountIo(): Promise<void> {
    const uri = `${this.host}:${this.port}`;
    this.instanceIo = await this.ioFactory(uri, this.key);
  }
}

export default WebSocket.getInstance;
