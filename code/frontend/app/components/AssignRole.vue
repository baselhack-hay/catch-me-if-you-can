<template>
  <div
    class="relative h-[calc(100vh-80px)] justify-between flex flex-col items-center gap-6"
  >
    <div class="flex flex-col items-center justify-between h-3/4">
      <div>
        <UiTitle class="uppercase text-7xl">You</UiTitle>
        <UiTitle class="uppercase text-7xl">are</UiTitle>
      </div>

      <div class="relative w-40 h-40 flex items-center justify-center">
        <div
          v-if="props.variant === 'bunny'"
          class="absolute w-36 h-36 bg-(--color-cookies-and-cream) rounded-full"
        />
        <div
          v-else
          class="absolute w-0 h-0"
          style="
            border-left: 5rem solid transparent;
            border-right: 5rem solid transparent;
            border-bottom: 8rem solid var(--color-cookies-and-cream);
          "
        />

        <!-- image -->
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

      <UiTitle
        class="mt-3 uppercase text-7xl"
        :style="{
          color:
            props.variant === 'hunter'
              ? 'var(--color-chinese-black)'
              : 'var(--color-cookies-and-cream)',
        }"
      >
        {{ variantLabel }}
      </UiTitle>
    </div>

    <div class="mb-5">
      <Button v-if="isReady === false" @click="confirmReady()">Ready?</Button>
      <div v-else>
        <UiTitle
          v-if="props.variant === 'hunter'"
          class="text-1xl text-(--color-chinese-black)"
        >
          Waiting for other players...
        </UiTitle>
        <UiTitle v-if="props.variant === 'bunny'" class="text-1xl">
          Waiting for other players...
        </UiTitle>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "./ui/button";
import { ref } from "vue";

interface Props {
  variant: "hunter" | "bunny";
}

const props = defineProps<Props>();

const variantLabel = computed(() =>
  props.variant === "hunter" ? "hunter" : "bunny"
);

const isReady = ref(false);

const confirmReady = () => {
  // TODO – Wait for other players to be ready
  // isReady.value = true;
  navigateTo(`/game`);
};
</script>

<style scoped>
.gradient::before {
  background: linear-gradient(transparent 25%, var(--color-orange) 100%);
}
</style>
