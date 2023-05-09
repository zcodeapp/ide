/* eslint-disable */

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
import Vue from 'vue';
import { IWebSocket } from "./plugins/websocket/websocket.interface";

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $websocket: IWebSocket
  }
}

declare module 'vite/types' {
  interface ImportMetaEnv {
    VITE_IDE_VERSION: string;
    VITE_SERVER_ADDRESS: string;
    VITE_SERVER_PORT: string;
  }
}