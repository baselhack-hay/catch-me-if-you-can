<script setup lang="ts">

</script>

<template>
  <div class="relative h-[calc(100vh-16px)] bg-(--color-chinese-black) overflow-hidden max-w-screen flex items-center justify-center ">
    <div class="gradient-base-rd gradient"></div>
    <h1 class="text-8xl z-10 text-(--color-cookies-and-cream)">10:00</h1>
  </div>
</template>
<style scoped>
.gradient::before {
  background: radial-gradient(var(--color-electric-red) 25%, transparent 75%);
  pointer-events: none;
  height: 80vh;
  width: 80vh;
  position: absolute;
  top: 10vh;
  left: 50%;
  margin-left: -40vh;
  overflow: hidden;
}

:root {
  overflow: hidden;
}
</style>
