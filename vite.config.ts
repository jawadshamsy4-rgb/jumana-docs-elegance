import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The adapter auto-runs Nitro with the `cloudflare-module` preset inside the
// Lovable sandbox. On Vercel, switch to the `vercel` preset and pin the
// output dir to `.vercel/output` (Vercel Build Output API location).
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  ...(isVercel
    ? {
        nitro: {
          preset: "vercel",
          output: { dir: ".vercel/output" },
        },
      }
    : {}),
});
