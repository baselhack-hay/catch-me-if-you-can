<template>
  <div
    class="h-screen relative gradient-base-y gradient"
    :style="{
      '--color-accent': role === 'hunter' ? '#970c02' : '#5e7601',
    }"
  >
    <BunnyCatch
      :variant="role"
      :hunter-name="'big hunter'"
      :bunny-name="'lil bunny'"
    />
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
