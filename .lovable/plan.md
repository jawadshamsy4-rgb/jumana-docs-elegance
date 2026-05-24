## What's actually broken

This is **not** preview-only — the published site is also returning HTTP 500 with the same branded "This page didn't load" page. Server logs confirm a single root cause on every request:

```
Error: No such module "assets/h3-v2".
  imported from "assets/server-BaWO-kTI.js"
```

The site runs on Cloudflare Workers (Lovable's runtime). Workers cannot resolve modules at runtime — everything must be bundled in. The current `vite.config.ts` builds the server bundle with `nitro({ preset: "vercel" })` plus a raw `tanstackStart()`, which splits `h3` v2 into a separate chunk that the Workers loader then can't find. Result: every SSR request crashes before any route code runs.

The project already has the correct Lovable wrapper installed (`@lovable.dev/vite-tanstack-config` in devDependencies) — it just isn't being used. That wrapper is what the Lovable TanStack template ships with and what produces a Workers-compatible bundle.

## Fix

**Replace `vite.config.ts`** with the Lovable standard:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
```

This:
- removes the conflicting `nitro({ preset: "vercel" })` plugin (wrong target for the Workers runtime)
- keeps `src/server.ts` as the worker entry (so the existing error-capture / branded fallback stays wired)
- restores the bundling rules Workers needs, so `h3` is inlined and the "No such module" error goes away

## What I will NOT touch

- No changes to any route, component, admin page, auth flow, database, or styling
- No package installs or removals
- No edits to `src/server.ts`, `src/start.ts`, `__root.tsx`, or any feature code

## Verification after the fix

1. Confirm the published URL returns 200 and renders the homepage.
2. Confirm `/admin` and `/auth` load.
3. Re-check server logs — the `No such module "assets/h3-v2"` errors should stop appearing on new requests.

If the error persists after the config swap, the next step is checking whether `vercel.json` (which currently sets `"buildCommand": "vite build"` and `"framework": null`) needs to be removed too, since Lovable deploys to Workers, not Vercel. I'll handle that as a follow-up only if needed.