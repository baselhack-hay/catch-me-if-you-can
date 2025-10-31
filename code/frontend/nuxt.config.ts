import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "shadcn-nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
