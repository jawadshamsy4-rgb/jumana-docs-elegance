import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

const maxUploadBytes = 8 * 1024 * 1024;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function cleanFileName(name: string) {
  return name.replace(/[^\w.-]/g, "_").slice(0, 120) || "service-image";
}

export const Route = createFileRoute("/api/admin/upload-service-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) return jsonResponse({ error: "Please sign in again before uploading." }, 401);

        const authClient = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const { data: userData, error: userError } = await authClient.auth.getUser(token);
        const userId = userData.user?.id;

        if (userError || !userId) return jsonResponse({ error: "Please sign in again before uploading." }, 401);

        const { data: role } = await supabaseAdmin
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();

        if (!role) return jsonResponse({ error: "Only admins can upload service images." }, 403);

        const formData = await request.formData();
        const file = formData.get("file");
        const serviceId = String(formData.get("serviceId") ?? "");
        const slug = String(formData.get("slug") ?? "service");

        if (!serviceId) return jsonResponse({ error: "Missing service details." }, 400);
        if (!(file instanceof File)) return jsonResponse({ error: "Please choose an image file." }, 400);
        if (!file.type.startsWith("image/")) return jsonResponse({ error: "Only image files can be uploaded." }, 400);
        if (file.size > maxUploadBytes) return jsonResponse({ error: "Image must be smaller than 8MB." }, 400);

        const path = `services/${slug || serviceId}-${Date.now()}-${cleanFileName(file.name)}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from("site-assets")
          .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: true });

        if (uploadError) return jsonResponse({ error: uploadError.message }, 400);

        const { data } = supabaseAdmin.storage.from("site-assets").getPublicUrl(path);
        const publicUrl = data.publicUrl;
        const { error: updateError } = await supabaseAdmin
          .from("services")
          .update({ image_url: publicUrl })
          .eq("id", serviceId);

        if (updateError) return jsonResponse({ error: updateError.message }, 400);

        return jsonResponse({ publicUrl });
      },
    },
  },
});