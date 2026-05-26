import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel builds, swap the default Cloudflare target for Nitro, which
// auto-detects the Vercel preset via the `VERCEL=1` env var Vercel sets
// during builds. Output goes to `.vercel/output`, which Vercel picks up
// automatically.
//
// Outside Vercel (Lovable preview / published), we keep the default
// Cloudflare target so the in-app preview keeps working. We dynamic-import
// nitro ONLY on Vercel — importing it unconditionally pulls h3-v2 into the
// Cloudflare worker dep graph and breaks the upload ("No such module h3-v2").
const isVercel = process.env.VERCEL === "1";

const nitroPlugins = isVercel
  ? [(await import("nitro/vite")).nitro()]
  : [];

export default defineConfig(
  isVercel
    ? { cloudflare: false, plugins: nitroPlugins, tanstackStart: { server: { entry: "server" } } }
    : { tanstackStart: { server: { entry: "server" } } },
);
