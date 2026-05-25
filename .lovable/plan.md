## Problem

On the Edit Service page (`/admin/services/$id`), clicking **Upload** for the detail page image shows: *"new row violates row-level security policy"*.

The upload targets the `site-assets` storage bucket. The existing INSERT policy on `storage.objects` is:

```
((bucket_id = 'site-assets') AND is_admin())
```

`is_admin()` is a `SECURITY DEFINER` function in the `public` schema. When called from the `storage.objects` RLS context, the `authenticated` role needs explicit `EXECUTE` permission on it — otherwise the call silently fails the policy check and the row is rejected. The user IS an admin in `user_roles` (verified: `jumanahdoc@gmail.com` → `admin`), so this is purely a permissions/policy plumbing issue, not a data issue.

## Fix

Rewrite the three `site-assets` storage policies to check `user_roles` directly (no dependency on `is_admin()` resolution), and explicitly grant execute on the helper functions to the `authenticated` role as a belt-and-braces measure.

### Migration

1. Drop the existing three `site-assets` policies on `storage.objects`.
2. Recreate them with an inline check against `public.user_roles`:
   ```sql
   EXISTS (
     SELECT 1 FROM public.user_roles
     WHERE user_id = auth.uid() AND role = 'admin'
   )
   ```
   for SELECT/INSERT/UPDATE/DELETE on `bucket_id = 'site-assets'` (INSERT/UPDATE use `WITH CHECK`, DELETE/UPDATE use `USING`).
3. `GRANT EXECUTE ON FUNCTION public.is_admin(), public.has_role(uuid, app_role) TO authenticated;` so other policies relying on these helpers also keep working.

No application code changes are needed — `onUpload()` in `src/routes/admin.services.$id.tsx` is already correct (uploads to `site-assets`, then updates `services.image_url`, then invalidates caches).

## Verification

After the migration:
- Reload the Edit Service page, click Upload, pick an image.
- Expect: "Image updated" toast, the preview thumbnail updates, and the public service detail page hero image refreshes.
