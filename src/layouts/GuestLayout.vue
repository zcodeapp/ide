<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ $t('zcode_title')}}
        </q-toolbar-title>
        <language-component />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <q-toolbar>
        <server-connected-component
          :connected="connected"
          :connecting="connecting"
          :error="error"
          :host="host"
          :port="port"
        />
        <q-space />
        <version-component />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ServerConnectedComponent from '../components/ServerConnectedComponent.vue';
import VersionComponent from '../components/VersionComponent.vue';
import LanguageComponent from '../components/LanguageComponent.vue';
import { websocketStore } from 'src/stores/websocket-store';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'GuestLayout',
  components: {
    ServerConnectedComponent,
    VersionComponent,
    LanguageComponent,
  },
  data() {
    const store = websocketStore();
    const { connected, isConnecting, error, host, port } = storeToRefs(store);
    return {
      connected: connected,
      connecting: isConnecting,
      error: error,
      host: host,
      port: port,
    }
  }
});
</script>
