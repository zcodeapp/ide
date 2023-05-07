<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          ZCode App
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <q-toolbar>
        <server-connected-component :connected="false" :connecting="false" host="https://localhost" port="9000" />
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

export default defineComponent({
  name: 'GuestLayout',
  components: {
    ServerConnectedComponent,
    VersionComponent,
  },
});
</script>
  