<script setup lang="ts">
const lobbyStore = useLobbyStore();

onMounted(() => {
  lobbyStore.retrieveFromSessionStorage();
});

async function onStartGame(): Promise<void> {
  lobbyStore.startGame();
}

async function onLeaveGame(): Promise<void> {
  lobbyStore.leaveLobby();
}
</script>

<template>
  <div>
    <UiTitle class="mb-20">Lobby {{ lobbyStore.code }}</UiTitle>

    <ol class="flex flex-col gap-4 list-decimal">
      <User
        v-for="(user, index) in lobbyStore.users"
        :key="user.id ?? index"
        :user="user"
      />
    </ol>

    <UiButton @click="onStartGame()"> Start </UiButton>
    <UiButton @click="onLeaveGame()"> Leave </UiButton>
  </div>
</template>
