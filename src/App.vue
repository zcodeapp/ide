<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  setup() {
    let query: { [name: string]: string } = {};
    const fullQuery = location.hash.split('?');
    if (fullQuery.length == 2) {
      const queries = fullQuery[1].split('&');
      if (queries.length > 0) {
        queries.map((q) => {
          const part = q.split('=');
          if (part.length == 2) query[part[0]] = part[1];
        });
        if (query?.lang) {
          const { locale } = useI18n({ useScope: 'global' });
          locale.value = query.lang;
        }
      }
    }
  },
});
</script>
