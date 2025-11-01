<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const totalSeconds = 10;
const timeLeft = ref(totalSeconds)
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onMounted(() => startTimer())
onBeforeUnmount(() => clearInterval(timer))

</script>

<template>
  <div class="relative h-[calc(100vh-16px)] bg-(--color-chinese-black) overflow-hidden max-w-screen flex items-center justify-center ">
    <div class="gradient-base-rd gradient"></div>
    <h1 class="text-8xl z-10 text-(--color-cookies-and-cream)">{{ formattedTime }}</h1>
    <NuxtLink v-if="timeLeft < 1" to="/lobby/map">
      <ui-button>Let's go</ui-button>
    </NuxtLink>
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
