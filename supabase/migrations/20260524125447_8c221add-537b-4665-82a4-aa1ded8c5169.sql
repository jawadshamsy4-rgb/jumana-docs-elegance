-- 1. Restrict public read on site_settings to a whitelist of public marketing keys
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;

CREATE POLICY "Public read public site settings"
ON public.site_settings
FOR SELECT
USING (
  key IN (
    'branding',
    'hero',
    'about',
    'contact',
    'services_section',
    'stats',
    'navigation',
    'footer',
    'seo',
    'social'
  )
  OR is_admin()
);

-- 2. Tighten the public inquiry INSERT policy with basic validation
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;

CREATE POLICY "Anyone can submit valid inquiry"
ON public.inquiries
FOR INSERT
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND position('@' IN email) > 1
  AND length(btrim(message)) BETWEEN 5 AND 5000
  AND (phone IS NULL OR length(btrim(phone)) BETWEEN 3 AND 40)
  AND (service IS NULL OR length(btrim(service)) BETWEEN 1 AND 200)
);

-- 3. Storage: drop the broad public SELECT that allowed listing the bucket.
--    Public bucket files remain accessible via their public CDN URLs.
DROP POLICY IF EXISTS "Public read site-assets objects" ON storage.objects;

-- 4. Revoke direct EXECUTE on internal trigger-only functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;