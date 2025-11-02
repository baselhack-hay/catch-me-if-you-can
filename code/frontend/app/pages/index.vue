<script setup>
import { ref, onMounted } from "vue";
import DialogTrigger from "~/components/ui/dialog/DialogTrigger.vue";

const lobbies = ref([]);
const userLocations = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/lobby");
  lobbies.value = Array.isArray(res) ? res : [];

  const userRes = await $fetch("/api/location");
  userLocations.value = Array.isArray(userRes) ? userRes : [];
});

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
}
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
      <li
        v-for="lobby in lobbies" :key="lobby.id" 
        @click="copyToClipboard(lobby.id)"
        class="cursor-pointer">
        {{ lobby.id }}
      </li>
    </ul>
  </div>
</template>
