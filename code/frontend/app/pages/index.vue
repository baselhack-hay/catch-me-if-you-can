<script setup>
import { ref, onMounted } from "vue";
import DialogTrigger from "~/components/ui/dialog/DialogTrigger.vue";

const lobbies = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/lobby");
  lobbies.value = Array.isArray(res) ? res : [];

    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {}
    );
  }
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

    <div class="z-10 mt-12">
        <h2 class="text-center mb-6 text-xl text-(--color-cookies-and-cream)">Verfügbare Lobbies</h2>
        <div class="flex flex-wrap gap-3 justify-center h-80 overflow-scroll">
        <div
          v-for="lobby in lobbies" :key="lobby.id"
          @click="copyToClipboard(lobby.id)"
          class="cursor-pointer w-24 rounded border-(--color-cookies-and-cream) border-2 p-1 mb-1 text-center">
          {{ lobby.id }}
        </div>
      </div>
    </div>
  </div>
</template>
