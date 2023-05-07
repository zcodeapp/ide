<template>
    <div>{{ $t('version', {
        version
    }) }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VersionComponent',
  data() {
    return {
      version: import.meta.env.VITE_IDE_VERSION
    }
  }
});
</script>