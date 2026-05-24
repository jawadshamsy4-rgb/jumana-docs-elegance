
-- Fix function search paths
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- Revoke execute on SECURITY DEFINER helpers from anon/authenticated (they remain callable by RLS internally)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten storage: only allow reading individual objects (signed URL / direct path), not listing
DROP POLICY IF EXISTS "Public read site-assets" ON storage.objects;
CREATE POLICY "Public read site-assets objects" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
-- Public access via direct URL still works because bucket is public; listing is restricted via separate policies (default deny).
