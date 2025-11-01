<template>
  <div
    class="h-screen relative gradient-base gradient"
    :style="{
      '--color-accent': role === 'hunter' ? '#970c02' : '#5e7601',
    }"
  >
    <AssignRole :variant="role" />
  </div>
</template>

<script setup lang="ts">
const role = "hunter";
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-accent) 100%);
  pointer-events: none;
}
</style>
