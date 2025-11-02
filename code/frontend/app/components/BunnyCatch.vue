<template>
  <div class="h-[calc(100vh-16px)] flex flex-col justify-center items-center">
    <div class="flex flex-col items-center justify-center text-center z-10">
      <UiTitle class="uppercase">
        {{ props.variant === "bunny" ? "You were caught" : "You caught" }}
      </UiTitle>

      <img src="/img/bunny_caught.png" alt="Bunny" class="w-60 py-10" />

      <UiTitle v-if="props.variant === 'bunny' && props.hunterName">
        {{ "by " + props.hunterName.toUpperCase() }}
      </UiTitle>
      <UiTitle v-else-if="props.variant === 'hunter' && props.bunnyName">
        {{ props.bunnyName.toUpperCase() }}
      </UiTitle>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant: "hunter" | "bunny";
  hunterName?: string;
  bunnyName?: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
}
</style>
