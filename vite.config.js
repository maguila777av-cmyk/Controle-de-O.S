import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" → funciona em qualquer subpasta (GitHub Pages, Netlify, Cloudflare Pages).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { chunkSizeWarningLimit: 700 }
});
