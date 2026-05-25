import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// On Vercel builds, swap the default Cloudflare target for Nitro, which
// auto-detects the Vercel preset via the `VERCEL=1` env var Vercel sets
// during builds. Output goes to `.vercel/output`, which Vercel picks up
// automatically — no `vercel.json` required.
//
// Outside Vercel (Lovable preview / published), we keep the default
// Cloudflare target so the in-app preview keeps working.
const isVercel = process.env.VERCEL === "1";

export default defineConfig(
  isVercel
    ? { cloudflare: false, plugins: [nitro()], tanstackStart: { server: { entry: "server" } } }
    : { tanstackStart: { server: { entry: "server" } } },
);
