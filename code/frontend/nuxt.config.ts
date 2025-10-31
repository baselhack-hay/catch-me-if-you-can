// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  server: {
    port: 3000,
  },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui"],
});
