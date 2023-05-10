import { Store } from 'pinia';
import { IWebSocket, WebSocketStatus } from './websocket.interface';
import { IWebSocketStoreActions, IWebSocketStoreStates } from 'src/stores/websocket-store';

class WebSocket implements IWebSocket {

  static instance: IWebSocket;

  constructor(
    private store: Store<'websocket', IWebSocketStoreStates, NonNullable<unknown>, IWebSocketStoreActions>,
    public host?: string,
    public port?: string,
  ){}

  static getInstance(
    store: Store<'websocket', IWebSocketStoreStates, NonNullable<unknown>, IWebSocketStoreActions>,
    host?: string,
    port?: string,
  ): IWebSocket {
    if (!WebSocket.instance) {
      WebSocket.instance = new WebSocket(store, host, port);
    }
    return WebSocket.instance
  }

  connect(success?: () => void, error?: () => void): void {
    this.store.change(WebSocketStatus.IS_CONNECTING);
    try {
      setTimeout(() => {
        this.store.change(WebSocketStatus.HAVE_ERROR);
        if (success) success();
      }, 5000)
    } catch (e) {
      if (error) error();
    }
  }
}

export default WebSocket.getInstance