import { IWebSocket, WebSocketStatus } from "./websocket.interface";
import { websocketStore } from 'src/stores/websocket-store';

class WebSocket implements IWebSocket {

  private store = websocketStore();

  constructor(
    public host?: string | undefined,
    public port?: string | undefined,
  ){}

  static instance: IWebSocket;

  static getInstance(
    host?: string | undefined,
    port?: string | undefined,
  ): IWebSocket {
    if (!WebSocket.instance) {
      WebSocket.instance = new WebSocket(host, port);
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