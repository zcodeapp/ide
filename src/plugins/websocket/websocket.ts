import { Store } from 'pinia';
import { IVersion, IWebSocket, IWebSocketOptions } from './websocket.interface';
import { IWebSocketStoreActions, IWebSocketStoreStates } from 'src/stores/websocket-store';
import { Socket, io } from 'socket.io-client';
import { Md5 } from 'ts-md5';

class WebSocket implements IWebSocket {

  private instanceIo?: Socket;
  private instanceSignature?: string;
  static instance?: IWebSocket;

  constructor(
    private store: Store<'websocket', IWebSocketStoreStates, NonNullable<unknown>, IWebSocketStoreActions>,
    public host: string,
    public port: string,
  ){}

  static getInstance(
    store: Store<'websocket', IWebSocketStoreStates, NonNullable<unknown>, IWebSocketStoreActions>,
    host: string,
    port: string,
  ): IWebSocket {
    if (!WebSocket.instance) {
      WebSocket.instance = new WebSocket(store, host, port);
    }
    return WebSocket.instance
  }

  async connect(options?: IWebSocketOptions, success?: (version: string) => void, error?: (error: Error) => void): Promise<void> {
    if (options) {
      const {
        host,
        port
      } = options;

      this.host = host;
      this.port = port;
    }

    this.getIo();
    
    await this.on('connect', async () => {
      await this.emit('version', (v: IVersion) => {
        if (success) success(v.version);
      })
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

  async emit<T>(event: string, callback: (...args: T[]) => void): Promise<void> {
    if (this.instanceIo) {
      this.instanceIo.emit(event, callback);
    }
  }

  async close(): Promise<void> {
    if (this.instanceIo) {
      this.instanceIo.close();
      this.instanceIo = undefined;
      this.instanceSignature = undefined;
    }
  }

  private getIo(): void {
    const connection = `${this.host}:${this.port}`;
    const hash = Md5.hashStr(connection);
    if (!this.instanceIo || hash != this.instanceSignature) {
      this.instanceSignature = hash;
      this.instanceIo = io(connection);
    }
  }
}

export default WebSocket.getInstance