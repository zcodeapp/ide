<template>
  <div>
    <q-select
      class="language"
      v-model="locale"
      :options="localeOptions"
      :label="$t('language')"
      emit-value
      map-options
      style="min-width: 150px"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'LanguageComponent',
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale,
      localeOptions: [
        { value: 'en-us', label: 'English' },
        { value: 'pt-br', label: 'Português Brasil' }
      ]
    }
  },
});
</script>

<style lang="scss">
.language {
  .q-field__native, .q-field__label, .q-field__append {
    color: #FFF !important;
  }
}

</style>