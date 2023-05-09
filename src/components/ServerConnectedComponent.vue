<template>
  <div v-if="connected">
    <q-icon name="wifi" />
    {{ $t('connected_on', {
      host,
      port
    }) }}
  </div>
    <div v-if="connecting">
      <q-icon name="sync_alt" />
      {{ $t('connecting', {
        host,
        port
      }) }}
    </div>
    <div v-if="!connected && !connecting && !error">
      <q-icon name="wifi_off" />
      {{ $t('not_connected') }}
    </div>
    <div v-if="error">
      <q-icon name="wifi_off" />
      {{ $t('error_connecting', {
        host,
        port
      }) }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { websocketStore } from 'src/stores/websocket-store';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

export default defineComponent({
  name: 'ServerConnectedComponent',
  props: {
    host: String,
    port: String,
    connected: Boolean,
    connecting: Boolean,
    error: Boolean,
  },
  watch: {
    error() {
      setTimeout(() => {
        const store = websocketStore();
        store.change(WebSocketStatus.NOT_CONNECTED)
      }, 5000)
    }
  }
});
</script>