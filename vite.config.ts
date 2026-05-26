import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The adapter auto-runs Nitro with the `cloudflare-module` preset inside the
// Lovable sandbox (output → `dist/`). On Vercel, switch to the `vercel`
// preset and route output to `.vercel/output/` (Vercel Build Output API).
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  ...(isVercel
    ? {
        nitro: {
          preset: "vercel",
          output: {
            dir: ".vercel/output",
            serverDir: ".vercel/output/functions/__server.func",
            publicDir: ".vercel/output/static",
          },
        },
      }
    : {}),
});
