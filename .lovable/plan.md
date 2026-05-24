## What's wrong today

The admin panel saves everything correctly to the database (services, hero/about/contact text, branding, image uploads, inquiries) — but **almost none of those changes appear on the public website**. The public pages still read from hard-coded files:

| Public page | Currently reads from | Should read from |
|---|---|---|
| Home hero (title, badge, subtitle, CTAs, bg image) | hardcoded in `index.tsx` + `@/assets/hero-skyline.jpg` | `site_settings.hero` |
| Home + Services service grid | hardcoded `src/lib/services.ts` | `services` table |
| Service detail page (`/services/:slug`) | hardcoded `src/lib/services.ts` + local images | `services` table + `image_url` |
| About page (text, values, founder, image) | hardcoded in `about.tsx` | `site_settings.about` |
| Contact page (phones, email, address, headings) | hardcoded in `contact.tsx` | `site_settings.contact` |
| Contact form submit | fake `setTimeout`, no DB insert | inserts into `inquiries` table |
| Home consultation form | only opens WhatsApp | also insert into `inquiries` so admin sees it |
| Header (logo, name, tagline, phone) | hardcoded `@/assets/logo.png` + "JUMANAH" | `site_settings.branding` + `site_settings.contact.phone1` |
| Footer (name, tagline, phones, email, address) | hardcoded | `site_settings.branding` + `site_settings.contact` |
| Fonts | only colors injected by `BrandStyle.tsx` | also `font_display` / `font_sans` from branding |

## Plan

### 1. Wire branding fully (colors AND fonts)
Extend `src/components/site/BrandStyle.tsx` so it:
- Keeps the current color override.
- Reads `font_display` / `font_sans` from `site_settings.branding`, dynamically appends a Google Fonts `<link>` for whichever pair is selected, and sets `--font-display` / `--font-sans` CSS vars on `:root` so Tailwind's `font-display` and base `body` font follow the admin choice.
- Falls back to current Playfair Display + Inter when no setting is saved.

### 2. Make Header use admin data
- Pull `branding` (logo_text, logo_tagline, logo_url) and `contact` (phone1) from `site_settings`.
- If `logo_url` is set, show it; otherwise show `logo_text` styled like today.
- The big phone button uses `phone1`.
- Keeps a default while loading so there's no flash.

### 3. Make Footer use admin data
- Brand name, tagline, both phones, email, address all come from `site_settings.branding` + `site_settings.contact`.
- Hardcoded "Services" list in the footer becomes the top 5 published services from the DB (graceful fallback to current static list while loading).

### 4. Make Home (`index.tsx`) fully dynamic
- Hero badge / 3 title lines / subtitle / CTA labels / phone all from `site_settings.hero` (+ `contact.phone1`).
- Background image: if `hero.image_url` is set, use it; otherwise the existing local skyline.
- Service grid: replace `services` from `src/lib/services.ts` with the published list from the `services` table, mapping `icon` string → Lucide component via `getIcon()` from `src/lib/icon-map.ts`. Each card links to `/services/$slug` using the DB slug.
- ConsultationForm: in addition to opening WhatsApp, insert a row into `inquiries` (name, email, phone, message, service = "Consultation") so it shows up in the admin inbox. WhatsApp link uses `contact.whatsapp`.

### 5. Make Services index dynamic
- `src/routes/services.tsx`: render the published services from the DB instead of `src/lib/services.ts`.
- Cards use icon from DB + DB slug.

### 6. Make Service detail dynamic
- `src/routes/services.$slug.tsx`: load the service by slug from Supabase (via `useService`). 404 if missing or unpublished (and not admin).
- Title, description, long description, highlights, icon all from DB.
- Hero image: use `image_url` from DB if set; otherwise keep the existing local image map by slug as fallback (preserves visuals for the 10 seeded services).
- Phone button uses `contact.phone1`.
- Update `head()` meta to use DB data, including og:image when `image_url` is set.

### 7. Make Contact page dynamic + actually submit
- Heading, subtitle, phones, email, address, WhatsApp from `site_settings.contact`.
- Form `onSubmit` inserts a row into `inquiries` (RLS already allows `Anyone can submit inquiry`). On success: toast + reset. On error: toast error.
- "Service Required" field becomes a `<select>` populated from published services.

### 8. Update `ServiceCard` to accept string icon names
Today it requires a `LucideIcon` prop. Change to accept either a Lucide component (for legacy call sites if any remain) or an `iconName` string + use `getIcon()`. Easiest: change all call sites to pass `iconName`, and `ServiceCard` resolves it once internally. This keeps the card simple and database-driven.

### 9. Keep `src/lib/services.ts` only as a fallback image map
It's still useful for the per-slug image fallbacks on `/services/$slug`. Reduce it to just `{ slug → fallbackImage }` — no titles/descriptions/icons in code anymore.

## Verification (test pass, after build)

After implementation, I will run these checks in order:

1. **Build check** — confirm the project builds (handled automatically by the harness).
2. **Public-site read tests** — use the database to bump a value (e.g. set `site_settings.hero.title_line1 = 'TEST JUMANAH'` via `supabase--insert`), then fetch the published home page and verify the new value appears, then revert. Repeat for one branding field (e.g. flip primary_color) and confirm the CSS variable changes in HTML. Revert.
3. **Services CRUD test** — toggle one service to unpublished via `supabase--insert`, fetch `/services` and confirm it disappears, then re-publish.
4. **Inquiry submission test** — fetch the contact page once to confirm it renders, then use `supabase--read_query` to confirm the inquiries table is reachable. (I can't simulate the actual form submit through a server fetch, so I'll verify the wiring by reading the code and confirming the RLS policy `Anyone can submit inquiry` is in place — it already is per the schema.)
5. **Admin pages reachable** — confirm `/admin`, `/admin/services`, `/admin/content`, `/admin/branding`, `/admin/inquiries`, `/admin/account` all render (already verified via auth fix).
6. Report a clean test summary back to you.

## What I will NOT touch

- Database schema (already has everything needed).
- Auth flow, admin sidebar, branding editor, content editor, services CRUD editor, account page — these all already save to the right places.
- The visual design / luxury card styling / animations of the public site.
- The 10 seeded service images under `src/assets/svc-*.jpg` (kept as fallback for the 10 default slugs).

## Files that will change

- `src/components/site/BrandStyle.tsx` (add fonts)
- `src/components/site/Header.tsx` (read settings)
- `src/components/site/Footer.tsx` (read settings)
- `src/components/site/ServiceCard.tsx` (icon by name)
- `src/routes/index.tsx` (hero + services from DB + insert inquiry)
- `src/routes/about.tsx` (about from DB)
- `src/routes/contact.tsx` (contact info + form insert)
- `src/routes/services.tsx` (DB-driven grid)
- `src/routes/services.$slug.tsx` (DB-driven detail)
- `src/lib/services.ts` (reduced to fallback image map)
- `src/lib/site-data.ts` (small additions: hook for inquiries insert helper if useful)