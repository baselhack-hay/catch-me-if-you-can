<script setup lang="ts">
const lobbyCode = useState<string>();
const nickname = useState<string>();
const lobbyStore = useLobbyStore();

async function onJoinLobby(): Promise<void> {
  try {
    const result = await lobbyStore.joinLobby(lobbyCode.value, nickname.value);
    if (result) {
      navigateTo("/lobby/overview");
    }
  } catch (e) {
    // TODO: show snackbar that lobby join failed
  }
}
</script>

<template>
  <div>
    <UiTitle class="mb-20">Join Lobby</UiTitle>
    <UiInput placeholder="Lobby Code" v-model="lobbyCode" />
    <UiInput placeholder="Nickname" v-model="nickname" />
    <UiButton @click="onJoinLobby()">Join</UiButton>
  </div>
</template>
