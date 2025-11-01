<script setup lang="ts">
import "./globals.css";

const lobbyStore = useLobbyStore();

onUnmounted(async () => {
  console.log("disconecting mqtt client...");
  await lobbyStore.disconnectMqttClient();
});
</script>

<template>
  <div
    class="font-joti relative gradient-base gradient min-h-screen border-8 border-(--color-chinese-black)"
  >
    <NuxtPage class="flex flex-col items-center gap-4 py-10 px-10" />
  </div>
</template>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
  pointer-events: none;
}
</style>
