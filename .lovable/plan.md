# Dynamic Google Maps Location Section

## 1. Database (migration)

Store as a single row in existing `site_settings` table under key `location_map` (matches existing pattern for hero/about/contact/social). No new table needed.

Add `"location_map"` to the public-read whitelist policy on `site_settings` so the homepage can read it without auth:

```sql
DROP POLICY "Public read public site settings" ON public.site_settings;
CREATE POLICY "Public read public site settings"
ON public.site_settings FOR SELECT
USING ((key = ANY (ARRAY['branding','hero','about','contact','services_section','stats','navigation','footer','seo','social','location_map'])) OR is_admin());
```

Seed default row:
```sql
INSERT INTO site_settings(key, value) VALUES ('location_map', '{
  "title": "Find Us",
  "description": "Visit our office in Ras Al Khaimah.",
  "embed_code": "",
  "is_enabled": false
}'::jsonb) ON CONFLICT (key) DO NOTHING;
```

## 2. Admin page — `src/routes/admin.location.tsx`

New route + sidebar entry in `src/routes/admin.tsx` (icon: `MapPin`, label "Location Map", path `/admin/location`).

Form fields:
- Section Title (Input, max 120)
- Section Description (Textarea, max 500)
- Google Maps Embed Code (Textarea, max 4000) — paste full `<iframe …></iframe>`
- Enable/Disable (Switch)
- Save button (upserts row), Reset button

Sanitization on save:
- Parse the pasted HTML, extract the first `<iframe>` `src`
- Accept ONLY if URL host is `www.google.com` and path starts with `/maps/embed` (also allow `maps.google.com/maps`)
- Reject anything else with toast error ("Only Google Maps embed iframes are allowed")
- Store the original embed_code string AND a normalized `src` so the frontend never injects arbitrary HTML
- Strip any `<script>` tags defensively

## 3. Frontend section — `src/components/site/LocationMap.tsx`

- Reads `useSetting<LocationMapSettings>("location_map")`
- Returns `null` if `!is_enabled` or no valid src
- Renders a section: title + description + responsive container with rounded corners (`luxury-card`, `rounded-2xl`, `overflow-hidden`)
- Renders `<iframe src={sanitizedSrc} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="w-full h-[420px] md:h-[480px] border-0">` — built from validated src, never `dangerouslySetInnerHTML`

## 4. Home page placement — `src/routes/index.tsx`

Insert `<LocationMap />` between the existing CTA section and `<SocialBar />`. No other changes.

## 5. Types

Add `LocationMapSettings` type next to other setting types in `src/lib/site-data.ts`:
```ts
export type LocationMapSettings = {
  title: string; description: string;
  embed_code: string; embed_src: string; is_enabled: boolean;
};
```

## Technical Details

- Security: only iframe `src` is rendered (no raw HTML injection); strict host allowlist (`google.com` / `maps.google.com`); URL parsed via `new URL()`.
- Persistence: leverages existing `site_settings` table — no new table, RLS, or grants needed beyond extending the existing public-read policy.
- Realtime updates: same pattern as hero/about/contact — admin saves → next homepage load (or React Query refetch) shows new map.
- Responsive: iframe `w-full`, height `420px` mobile / `480px` desktop.

## Out of scope
No changes to footer, social bar, or other admin sections.
