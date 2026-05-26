import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The adapter auto-runs Nitro with the `cloudflare-module` preset inside the
// Lovable sandbox. On Vercel, set `nitro: true` and override the preset so
// Nitro emits `.vercel/output/` (Build Output API) instead.
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
});
