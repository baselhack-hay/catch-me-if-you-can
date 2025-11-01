<script lang="ts">
import "./globals.css";
</script>

<template>
  <div class="font-joti relative gradient-base gradient min-h-screen">
    <NuxtPage />
  </div>
</template>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
  pointer-events: none;
}
</style>
