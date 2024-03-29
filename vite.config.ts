import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
