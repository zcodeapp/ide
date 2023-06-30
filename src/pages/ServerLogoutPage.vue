<script lang="ts">
import { WebSocketStatus } from '../plugins/websocket/websocket.interface';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ServerLogoutPage',
  beforeMount() {
    this.$websocketStore.change(WebSocketStatus.NOT_CONNECTED);
    this.$websocketStore.changeVersion('');
    this.$router.replace('/');
  },
});
</script>
