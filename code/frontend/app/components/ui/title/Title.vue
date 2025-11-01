<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h1
    :class="
      cn(
        'text-5xl font-bold text-(--color-cookies-and-cream) md:text-6xl',
        props.class
      )
    "
  >
    <slot />
  </h1>
</template>
