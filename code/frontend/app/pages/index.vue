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

    <ui-dialog>
      <ui-dialog-trigger>
        Edit Profile
      </ui-dialog-trigger>

      <ui-dialog-content>
        <ui-dialog-header>
          <ui-dialog-title>
            Hunter <span>Cyril</span> said they caught you.
          </ui-dialog-title>
        </ui-dialog-header>

        <ui-button>Accept</ui-button>
        <ui-button>Deny</ui-button>
      </ui-dialog-content>
    </ui-dialog>

    <h2>Verfügbare Lobbies</h2>
      <ul>
        <li 
          v-for="location in userLocations" 
          :key="location.id"
          :class="!location.geolocation ? 'opacity-50 text-gray-400' : ''"
        >
        <span v-if="location.geolocation">
          {{ location.id }} + {{ location.username }} - {{ location.geolocation }}
          </span>

        </li>
      </ul>
  </div>
</template>
