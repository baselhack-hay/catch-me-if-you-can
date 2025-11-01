import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xl font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-2 border-black text-black w-full",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-(--color-selective-orange) to-(--color-cookies-and-cream)",
        secondary:
          "bg-gradient-to-r from-(--color-selective-yellow) to-(--color-orange)",
        gradient:
          "bg-gradient-to-r from-(--color-electric-red) via-(--color-orange) via-50% to-(--color-avocado)",
        primary:
          "bg-gradient-to-r from-(--color-selective-orange) to-(--color-cookies-and-cream)",
        positive:
          "bg-gradient-to-r from-(--color-avocado) to-(--color-cookies-and-cream)",
        negative:
          "bg-gradient-to-r from-(--color-electric-red) to-(--color-cookies-and-cream)",
      },
      size: {
        default: "h-14 px-4 py-2 has-[>svg]:px-3",
        sm: "h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-18 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
