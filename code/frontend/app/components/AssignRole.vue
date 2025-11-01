<template>
  <div
    class="relative h-[calc(100vh-80px)] justify-between flex flex-col items-center gap-6"
  >
    <div class="flex flex-col items-center justify-between">
      <UiTitle class="uppercase text-7xl">You</UiTitle>
      <UiTitle class="uppercase text-7xl">are</UiTitle>

      <div class="relative w-40 h-40 flex items-center justify-center">
        <div
          v-if="props.variant === 'bunny'"
          class="absolute w-36 h-36 bg-(--color-cookies-and-cream) rounded-full"
        />

        <div
          v-else-if="props.variant === 'hunter'"
          class="absolute w-0 h-0"
          style="
            border-left: 5rem solid transparent;
            border-right: 5rem solid transparent;
            border-bottom: 8rem solid var(--color-cookies-and-cream);
          "
        />

        <img
          v-if="props.variant === 'bunny'"
          src="/img/bunny_alt.png"
          alt="Bunny"
          class="relative z-10 w-48"
        />
        <img
          v-else
          src="/img/hunter_hat.png"
          alt="Hunter"
          class="relative z-10 min-w-48"
        />
      </div>

      <UiTitle class="mt-3 uppercase text-7xl">{{ variantLabel }}</UiTitle>
    </div>
    <div class="mb-5">
      <Button @click="confirmReady()">Ready?</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "./ui/button";

interface Props {
  variant: "hunter" | "bunny";
}

const props = defineProps<Props>();

const variantLabel = computed(() =>
  props.variant === "hunter" ? "hunter" : "bunny"
);

const confirmReady = () => {};
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
}
</style>
