import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Nitro auto-detects the Vercel preset when `VERCEL=1` is set in the build env
// (Vercel sets this automatically). Output goes to `.vercel/output`, which
// Vercel picks up with zero further configuration.
export default defineConfig({
  cloudflare: false,
  plugins: [nitro()],
});
