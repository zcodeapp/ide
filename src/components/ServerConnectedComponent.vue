<template>
  <div v-if="connected">
    <q-icon name="wifi" />
    {{
      $t('connected_on', {
        host,
        port,
        version,
      })
    }}
  </div>
  <div v-if="connecting">
    <q-icon name="sync_alt" />
    {{
      $t('connecting', {
        host,
        port,
      })
    }}
  </div>
  <div v-if="!connected && !connecting && !error">
    <q-icon name="wifi_off" />
    {{ $t('not_connected') }}
  </div>
  <div v-if="error">
    <q-icon name="wifi_off" />
    {{
      $t('error_connecting', {
        host,
        port,
      })
    }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';

export default defineComponent({
  name: 'ServerConnectedComponent',
  props: {
    host: String,
    port: String,
    version: String,
    connected: Boolean,
    connecting: Boolean,
    error: Boolean,
  },
  watch: {
    error() {
      clearTimeout(this.timeout);
      if (this.error) {
        this.timeout = setTimeout(() => {
          this.$websocketStore.change(WebSocketStatus.NOT_CONNECTED);
        }, 5000);
      }
    },
  },
  data() {
    return {
      timeout: {} as NodeJS.Timeout,
    };
  },
});
</script>
