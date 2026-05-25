DROP POLICY IF EXISTS "Public read site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins read site-assets" ON storage.objects;

CREATE POLICY "Admins read site-assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);