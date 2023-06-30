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
            name="address"
            filled
            :disable="lock_fields"
            v-model="data_address"
            :rules="[
              (val) =>
                String(val).match(/^(http|https|ws)?:\/\/[a-zA-Z0-9]+/g)
                  ?.length || $t('type_valid_address'),
              (val) => (val && val.length > 0) || $t('type_something'),
            ]"
            :error="inputAddressError"
            :label="$t('server_address_label')"
          />
          <q-input
            name="port"
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
            :error="inputPortError"
            :label="$t('server_port_label')"
          />
          <q-input
            name="key"
            filled
            :disable="lock_fields"
            v-model="data_key"
            :rules="[(val) => (val && val.length > 0) || $t('type_something')]"
            :error="inputKeyError"
            :label="$t('server_key_label')"
          />
          <q-banner
            v-if="inputErrors.length > 0"
            inline-actions
            class="text-white bg-red error-message"
          >
            <div v-for="error in inputErrors" :key="error">{{ $t(error) }}</div>
            <template v-slot:action>
              <q-icon
                name="close"
                class="cursor-pointer"
                @click="closeErrors"
              />
            </template>
          </q-banner>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn
            name="next"
            :label="$t(buttonNext.label)"
            :icon="buttonNext.icon"
            type="button"
            :color="buttonNext.color"
            :loading="lock_fields"
            :disable="
              lock_fields || !data_address || !data_port || !data_key || success
            "
            @click="updateData"
            class="btn_next"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { WebSocketStatus } from '../plugins/websocket/websocket.interface';
import { defineComponent } from 'vue';
import { WebSocketSystemError } from '../plugins/websocket/websocket.interface';

export default defineComponent({
  name: 'ServerConfigurePage',
  props: {
    address: String,
    port: String,
  },
  methods: {
    async updateData() {
      this.lock_fields = true;
      this.inputErrors = [];
      this.inputKeyError = false;
      this.inputAddressError = false;
      this.inputPortError = false;
      this.$websocketStore.configure(
        this.data_address,
        String(this.data_port),
        this.data_key
      );
      this.$websocketStore.change(WebSocketStatus.IS_CONNECTING);

      const error = (error: Error & WebSocketSystemError) => {
        console.log('error', { error });
        this.$websocketStore.change(WebSocketStatus.HAVE_ERROR);
        this.lock_fields = false;
        if (error.context && typeof error.context == 'string') {
          if (error.context == 'connect') {
            if (error.message == 'server_key_not_valid') {
              this.inputKeyError = true;
            }
            this.inputErrors.push(error.message);
          }
        } else {
          let errorMessage = error.message;
          if (errorMessage == 'xhr poll error') {
            errorMessage = 'server_address_port_error';
            this.inputAddressError = true;
            this.inputPortError = true;
          }
          if (errorMessage == 'timeout') {
            errorMessage = 'server_timeout_error';
            this.inputAddressError = true;
            this.inputPortError = true;
          }
          this.inputErrors.push(errorMessage);
        }
      };

      await this.$websocket.connect(
        {
          host: this.data_address,
          port: String(this.data_port),
          key: this.data_key,
        },
        (version: string) => {
          this.$websocketStore.change(WebSocketStatus.IS_CONNECTED);
          this.$websocketStore.changeVersion(version);
          this.lock_fields = false;
          this.buttonDone();
        },
        error
      );
    },
    closeErrors() {
      this.inputErrors = [];
    },
    buttonDone() {
      this.success = true;
      this.buttonNext = {
        label: 'done',
        icon: 'done',
        color: 'green',
      };
      setTimeout(() => {
        this.success = false;
        this.buttonNext = {
          label: 'connect',
          icon: 'chevron_right',
          color: 'primary',
        };
        this.$router.replace('/server/prepare');
      }, 1000);
    },
  },
  beforeMount() {
    const state = this.$websocketStore.currentState();
    if (state == WebSocketStatus.IS_CONNECTED) {
      this.$router.replace('/server/prepare');
    }
  },
  data() {
    return {
      lock_fields: false,
      data_address: this.$websocketStore.host,
      data_port: Number(this.$websocketStore.port),
      data_key: this.$websocketStore.key,
      inputKeyError: false,
      inputAddressError: false,
      inputPortError: false,
      success: false,
      inputErrors: [],
      buttonNext: {
        label: 'connect',
        icon: 'chevron_right',
        color: 'primary',
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.server-configure {
  min-width: 600px;
  max-width: 800px;
}
.q-banner-item {
}
</style>
