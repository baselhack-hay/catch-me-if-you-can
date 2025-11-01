import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    // "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
    },
  },
  alias: {
    types: fileURLToPath(new URL("../types", import.meta.url)),
    validationTypes: fileURLToPath(
      new URL("app/types/validation", import.meta.url),
    ),
  },
});
