import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel (disables Cloudflare plugin, uses Vercel preset)
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "vercel",
  },
});
