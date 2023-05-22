import { IVersion, IWebSocket, IWebSocketOptions } from './websocket.interface';
import { Socket } from 'socket.io-client';
import { Md5 } from 'ts-md5';

export class WebSocket implements IWebSocket {
  private instanceIo?: {
    hash: string;
    instance: Socket;
  };
  static instance?: IWebSocket;

  constructor(
    public host: string,
    public port: string,
    private ioFactory: (uri: string) => Promise<Socket>
  ) {}

  static getInstance(
    host?: string,
    port?: string,
    ioFactory?: (uri: string) => Promise<Socket>
  ): IWebSocket {
    if (!WebSocket.instance) {
      if (!ioFactory) {
        throw new Error(
          'To get websocket instance configure ioFactory'
        );
      }
      WebSocket.instance = new WebSocket(host || '', port || '', ioFactory);
    }
    return WebSocket.instance;
  }

  async connect(
    options?: IWebSocketOptions,
    success?: (version: string) => void,
    error?: (error: Error) => void
  ): Promise<void> {
    if (options) {
      const { host, port } = options;

      this.host = host;
      this.port = port;
    }

    await this.getIo();

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
    if (this.instanceIo?.instance) {
      this.instanceIo.instance.on(event, callback);
    }
  }

  async emit<T>(
    event: string,
    callback: (...args: T[]) => void
  ): Promise<void> {
    if (this.instanceIo?.instance) {
      this.instanceIo.instance.emit(event, callback);
    }
  }

  async close(): Promise<void> {
    if (this.instanceIo?.instance) {
      this.instanceIo.instance.close();
      this.instanceIo = undefined;
    }
  }

  private async getIo(): Promise<void> {
    const uri = `${this.host}:${this.port}`;
    const hash = Md5.hashStr(uri);
    if (!this.instanceIo?.instance || hash != this.instanceIo?.hash) {
      this.instanceIo = {
        hash,
        instance: await this.ioFactory(uri),
      };
    }
  }
}

export default WebSocket.getInstance;
