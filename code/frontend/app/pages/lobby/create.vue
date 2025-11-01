<script setup lang="ts">
const lobbyName = useState<string>();
const nickname = useState<string>();

const lobbyStore = useLobbyStore();

async function onCreateLobby(): Promise<void> {
  const result = await lobbyStore.createLobby(lobbyName.value, nickname.value);
  return Promise.resolve();
}
</script>
<template>
  <div>
    <UiTitle class="mb-20">Lobby erstellen</UiTitle>
    <UiInput placeholder="Lobbyname" v-model="lobbyName" />
    <UiInput placeholder="Nickname" v-model="nickname" />
    <UiButton variant="secondary" @click="onCreateLobby()">erstellen</UiButton>
  </div>
</template>
