## Problem

In the admin Edit Service page, uploading a "Detail page image" only updates the in-memory form. The new URL isn't written to the `services` table until the user clicks **Save changes**, so the public `/services/$slug` page keeps showing the old/fallback image. Users reasonably expect the upload itself to take effect.

## Fix

Update `src/routes/admin.services.$id.tsx` → `onUpload()` so that after a successful upload it also writes `image_url` directly to the database for the current service, then invalidates the relevant React Query caches.

Steps inside `onUpload`:
1. Upload file to `site-assets` bucket (unchanged).
2. Get the public URL (unchanged).
3. `await supabase.from("services").update({ image_url: publicUrl }).eq("id", form.id)`.
4. On success: `update({ image_url: publicUrl })` to sync the form, invalidate `["admin-services"]`, `["admin-service", id]`, `["services"]`, and `["service", form.slug]`, then toast "Image updated".
5. On error: toast the error and don't change form state.

No other files change. The detail page already reads `service.image_url` correctly, so once it's persisted the new image appears on the next fetch.

## Note for the user

The image will also still be saved as part of "Save changes" if you only paste a URL into the text field — only the file-upload path becomes instant.
