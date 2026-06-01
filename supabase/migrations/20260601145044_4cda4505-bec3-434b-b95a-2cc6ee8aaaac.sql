DROP POLICY IF EXISTS "Public read public site settings" ON public.site_settings;
CREATE POLICY "Public read public site settings"
ON public.site_settings FOR SELECT
USING ((key = ANY (ARRAY['branding','hero','about','contact','services_section','stats','navigation','footer','seo','social','location_map'])) OR is_admin());

INSERT INTO public.site_settings(key, value) VALUES ('location_map', '{
  "title": "Find Us",
  "description": "Visit our office in Ras Al Khaimah.",
  "embed_code": "",
  "embed_src": "",
  "is_enabled": false
}'::jsonb) ON CONFLICT (key) DO NOTHING;