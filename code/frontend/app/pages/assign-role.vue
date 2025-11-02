<template>
  <div
    class="h-[calc(100vh-16px)] relative gradient-base-y gradient"
    :style="{
      '--color-accent': role === 'hunter' ? '#970c02' : '#5e7601',
    }"
  >
    <AssignRole :variant="role" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const role = computed(() => route.query.role ?? "hunter");
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-accent) 100%);
  pointer-events: none;
}
</style>
