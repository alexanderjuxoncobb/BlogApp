import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 5174, // Different port from client-user (5173)
  },
});
