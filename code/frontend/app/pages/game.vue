<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

onMounted(() => {
  // Sofort weiterleiten
  router.push("lobby/map");
});
</script>

<template>
  <UiTitle>Game has started</UiTitle>
</template>