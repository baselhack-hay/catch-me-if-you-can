<script setup lang="ts">
const lobbyStore = useLobbyStore();

onMounted(() => {
  console.log("current users: ", lobbyStore.users);
});

async function onStartGame(): Promise<void> {
  lobbyStore.startGame();
}
</script>

<template>
  <h1>Lobby {{ lobbyStore.code }}</h1>

  <ol class="flex flex-col gap-4 list-decimal">
    <User v-for="user in lobbyStore.users" :user="user" />
  </ol>

  <UiButton @click="onStartGame()"> Start </UiButton>
</template>
