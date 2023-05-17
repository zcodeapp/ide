<template>
  <q-page class="row justify-center">
    <div class="q-pa-md">
      <q-card class="server-configure">
        <q-card-section>
          <div class="text-h6">{{ $t('server_select') }}</div>
          <div class="text-subtitle2">
            {{ $t('server_select_description') }}
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <q-input
            filled
            :disable="lock_fields"
            v-model="data_address"
            :rules="[
              (val) =>
                String(val).match(/^(http|https|ws)?:\/\/[a-zA-Z0-9]+/g)
                  ?.length || $t('type_valid_address'),
              (val) => (val && val.length > 0) || $t('type_something'),
            ]"
            :label="$t('server_address_label')"
          />
          <q-input
            filled
            :disable="lock_fields"
            v-model="data_port"
            type="number"
            :rules="[
              (val) => (val && val > 0) || $t('type_something'),
              (val) =>
                val >= Number($t('server_port_min')) ||
                $t('server_port_min_label', {
                  port: $t('server_port_min'),
                }),
            ]"
            :label="$t('server_port_label')"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('back')"
            :disable="true"
            type="button"
            color="primary"
            flat
          />
          <q-space />
          <q-btn
            :label="$t('next')"
            type="button"
            color="primary"
            :loading="lock_fields"
            :disable="lock_fields || !data_address || !data_port"
            @click="updateData"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { WebSocketStatus } from 'src/plugins/websocket/websocket.interface';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ServerConfigurePage',
  props: {
    address: String,
    port: String,
  },
  methods: {
    async updateData() {
      this.lock_fields = true;
      this.$websocketStore.configure(this.data_address, String(this.data_port));
      this.$websocketStore.change(WebSocketStatus.IS_CONNECTING);
      await this.$websocket.connect(
        {
          host: this.data_address,
          port: String(this.data_port),
        },
        (version: string) => {
          this.$websocketStore.change(WebSocketStatus.IS_CONNECTED);
          this.$websocketStore.changeVersion(version);
          this.lock_fields = false;
        },
        () => {
          this.$websocketStore.change(WebSocketStatus.HAVE_ERROR);
          this.lock_fields = false;
        }
      );
    },
  },
  data() {
    return {
      lock_fields: false,
      data_address: this.$websocketStore.host,
      data_port: Number(this.$websocketStore.port),
    };
  },
});
</script>

<style lang="scss" scoped>
.server-configure {
  min-width: 600px;
  max-width: 800px;
}
</style>
