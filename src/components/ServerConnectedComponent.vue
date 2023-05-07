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
    <div v-if="!connected && !connecting">
      <q-icon name="wifi_off" />
      {{ $t('not_connected') }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ServerConnectedComponent',
  props: {
    host: String,
    port: String,
    connected: Boolean,
    connecting: Boolean,
  },
});
</script>