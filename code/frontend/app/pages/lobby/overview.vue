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
  <div
    class="relative h-[calc(100vh-16px)] bg-(--color-chinese-black) overflow-hidden"
  >
    <div
      class="absolute -left-3/4 -top-[20vw] h-[50vh] gradient-base gradient-base-y gradient rotate-35 z-0"
    ></div>
    <div
      class="absolute -right-3/4 -bottom-[20vw] h-[50vh] gradient-base gradient-base-y gradient rotate-215 z-0"
    ></div>
    <UiTitle class="mb-20 z-10">Lobby {{ lobbyStore.code }}</UiTitle>

    <ol class="flex flex-col gap-4 list-decimal z-10">
      <User
        v-for="(user, index) in lobbyStore.users"
        :key="user.id ?? index"
        :user="user"
      />
    </ol>

    <UiButton @click="onStartGame()" class="z-10"> Start </UiButton>
    <UiButton @click="onLeaveGame()" class="z-10"> Leave </UiButton>
  </div>
</template>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
  pointer-events: none;
}
</style>
