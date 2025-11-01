<script setup lang="ts">
import type { LobbyUser } from "types/lobby";

const { user } = defineProps<{ user: LobbyUser }>();
</script>

<template>
  <li class="list-decimal">{{ user.username }}</li>
</template>
