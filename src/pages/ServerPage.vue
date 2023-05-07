<template>
    <q-page class="row justify-center">
      <div>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ $t('server_select') }}</div>
            <div class="text-subtitle2">{{ $t('server_select_description') }}</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <q-input
                filled
                v-model="address"
                :rules="[ 
                  val => String(val).match(/^https?:\/\/[a-zA-Z0-9]+/g)?.length || $t('type_valid_address'),
                  val => val && val.length > 0 || $t('type_something')
                ]"
                :label="$t('server_address_label')"
              />
              <q-input
                filled
                v-model="port"
                type="number"
                :rules="[
                  val => val && val > 0 || $t('type_something'),
                  val => val >= Number($t('server_port_min')) || $t('server_port_min_label', {
                    'port': $t('server_port_min')
                  }),
                ]"
                :label="$t('server_port_label')"
              />
          </q-card-section>
          <q-card-actions>
              <q-btn :label="$t('back')" :disable="true" type="button" color="primary" flat/>
              <q-space />
              <q-btn :label="$t('next')" type="button" color="primary"/>
          </q-card-actions>
        </q-card>
      </div>
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'ServerPage',
    data() {
      return {
        address: import.meta.env.VITE_SERVER_ADDRESS,
        port: Number(import.meta.env.VITE_SERVER_PORT)
      }
    },
  });
  </script>
  