import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel builds, swap the default Cloudflare target for Nitro (which
// auto-detects the Vercel preset via the `VERCEL=1` env var Vercel sets
// during builds). Nitro is loaded dynamically so it is NOT pulled into
// the Lovable/Cloudflare build graph (which would inject h3 modules that
// Cloudflare's Worker runtime cannot resolve).
//
// Outside Vercel (Lovable preview / published), we keep the default
// Cloudflare target so the in-app preview and lovable.app domain work.
const isVercel = process.env.VERCEL === "1";

const vercelConfig = isVercel
  ? await import("nitro/vite").then((m) => ({
      cloudflare: false as const,
      plugins: [m.nitro()],
    }))
  : {};

export default defineConfig(vercelConfig);
