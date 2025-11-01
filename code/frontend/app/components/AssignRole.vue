<template>
  <div
    class="py-12 relative h-screen text-8xl uppercase justify-between flex flex-col items-center gap-6 text-(--color-cookies-and-cream)"
  >
    <div class="flex flex-col items-center justify-between">
      <p>You</p>
      <p>are</p>

      <div class="relative w-40 h-40 flex items-center justify-center">
        <div
          v-if="props.variant === 'bunny'"
          class="absolute w-36 h-36 bg-(--color-cookies-and-cream) rounded-full"
        ></div>

        <div
          v-else-if="props.variant === 'hunter'"
          class="absolute w-0 h-0"
          style="
            border-left: 5rem solid transparent;
            border-right: 5rem solid transparent;
            border-bottom: 8rem solid var(--color-cookies-and-cream);
          "
        ></div>

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

      <p class="mt-3">{{ variantLabel }}</p>
    </div>

    <Button onclick="confirmReady()">Ready?</Button>
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
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
}
</style>
