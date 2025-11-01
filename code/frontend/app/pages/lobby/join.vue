<script setup lang="ts">
const lobbyCode = useState<string>();
const lobbyStore = useLobbyStore();

async function onJoinLobby(): Promise<void> {
  console.log(lobbyCode.value);
  const result = await lobbyStore.joinLobby(lobbyCode.value);
  if (result) {
    // TODO: navigate to detail page
  }

  // TODO: show snackbar that lobby join failed
}
</script>

<template>
  <div>
    <h1>Join Lobby</h1>
    <UiInput placeholder="Lobby Code" v-model="lobbyCode" />
    <UiButton @click="onJoinLobby()">Join</UiButton>
  </div>
</template>
