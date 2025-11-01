<script setup>
import { ref, onMounted } from "vue";

const lobbies = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/lobby");
  lobbies.value = Array.isArray(res) ? res : [];
});
</script>

<template>
  <div>
    <UiTitle class="self-start">Catch me</UiTitle>
    <UiTitle class="self-end mb-20">if you can</UiTitle>
    <NuxtLink to="/lobby/join"
      ><UiButton variant="default">Join Lobby</UiButton></NuxtLink
    >
    <NuxtLink to="/lobby/create"
      ><UiButton variant="secondary">Create Lobby</UiButton></NuxtLink
    >
    <NuxtLink to="lobby/map"
      ><UiButton variant="secondary">Show Map</UiButton></NuxtLink
    >

    <h2>Verfügbare Lobbies</h2>
    <ul>
      <li v-for="lobby in lobbies" :key="lobby.id">
        {{ lobby.id }}
      </li>
    </ul>
  </div>
</template>
