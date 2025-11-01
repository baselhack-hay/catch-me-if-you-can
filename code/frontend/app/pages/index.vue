<script setup>
import { ref, onMounted } from 'vue'

const lobbies = ref([])

onMounted(async () => {
    const res = await $fetch('/api/lobby')
    lobbies.value = Array.isArray(res) ? res : []
})
</script>

<template>
  <div>
    <h1>Catch me if you can</h1>
    <NuxtLink to="/lobby/create"><UiButton>Lobby erstellen</UiButton></NuxtLink>
    <NuxtLink to="/lobby/join"><UiButton>Lobby beitreten</UiButton></NuxtLink>

    <h2>Verfügbare Lobbies</h2>
    <ul>
      <li v-for="lobby in lobbies" :key="lobby.id">
      {{ lobby.id }}
      </li>
    </ul>
  </div>
</template>
