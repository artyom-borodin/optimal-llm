import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "../public",
    emptyOutDir: true
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787"
    }
  }
});
