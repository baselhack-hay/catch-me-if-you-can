<template>
  <div class="relative w-60">
    <!-- div for shadow effect -->
    <div
      class="absolute top-0.5 left-0 w-full h-full rounded-md z-0"
      :class="getUnderLayerClass(variant)"
    ></div>

    <!-- button itself -->
    <Primitive
      data-slot="button"
      :as="as"
      :as-child="asChild"
      :class="
        cn(buttonVariants({ variant, size }), props.class, 'relative z-10')
      "
    >
      <slot />
    </Primitive>
  </div>
</template>

<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
const { variant, size } = props;

// function to get the class for the shadow effect
const getUnderLayerClass = (variant?: string) => {
  switch (variant) {
    case "default":
      return "bg-gradient-to-r from-(--color-selective-yellow) to-(--color-orange)";
    case "secondary":
      return "bg-(--color-cookies-and-cream)";
    case "gradient":
      return "bg-(--color-cookies-and-cream)";
    case "primary":
    case "positive":
    case "negative":
    default:
      return "bg-(--color-chinese-black)";
  }
};
</script>
