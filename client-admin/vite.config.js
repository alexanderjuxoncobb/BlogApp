import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  css: {
    postcss: "./postcss.config.js",
  },
  define: {
    __CLIENT_URL__: JSON.stringify(
      "https://blog-api-top-production.up.railway.app/"
    ),
  },
});
