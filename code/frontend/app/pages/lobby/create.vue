<script setup lang="ts">
const lobbyName = useState<string>();
const nickname = useState<string>();

const lobbyStore = useLobbyStore();

async function onCreateLobby(): Promise<void> {
  await lobbyStore.createLobby(lobbyName.value, nickname.value);
}
</script>
<template>
  <div>
    <UiTitle class="mb-20">Create Lobby</UiTitle>
    <UiInput placeholder="Lobbyname" v-model="lobbyName" />
    <UiInput placeholder="Nickname" v-model="nickname" />
    <UiButton variant="secondary" @click="onCreateLobby()">Create</UiButton>
  </div>
</template>
