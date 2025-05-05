// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  output: "server",
  // site: "https://infinitysupport.heathcotetech.com.au,

  integrations: [svelte()],
  adapter: cloudflare(),
});