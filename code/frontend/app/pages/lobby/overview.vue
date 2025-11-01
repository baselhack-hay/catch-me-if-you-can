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
  </div>
</template>
