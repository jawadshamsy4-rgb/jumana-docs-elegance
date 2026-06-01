import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { LocationMapSettings } from "@/lib/site-data";

export const Route = createFileRoute("/admin/location")({ component: LocationAdmin });

const DEFAULTS: LocationMapSettings = {
  title: "Find Us",
  description: "",
  embed_code: "",
  embed_src: "",
  is_enabled: false,
};

/** Extract iframe src and validate it points to Google Maps. */
function extractGoogleMapsSrc(input: string): string | null {
  if (!input) return null;
  // If user pasted just a URL
  const trimmed = input.trim();
  let candidate: string | null = null;

  if (/^https?:\/\//i.test(trimmed)) {
    candidate = trimmed;
  } else {
    const match = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (match) candidate = match[1];
  }
  if (!candidate) return null;

  let url: URL;
  try { url = new URL(candidate); } catch { return null; }

  const host = url.hostname.toLowerCase();
  const okHost =
    host === "www.google.com" ||
    host === "google.com" ||
    host === "maps.google.com" ||
    host.endsWith(".google.com");
  if (!okHost) return null;
  if (!/\/maps(\/embed|\?|$)/.test(url.pathname + url.search)) return null;
  // Force https
  url.protocol = "https:";
  return url.toString();
}

function LocationAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-location-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings").select("value").eq("key", "location_map").maybeSingle();
      if (error) throw error;
      return (data?.value ?? DEFAULTS) as LocationMapSettings;
    },
  });

  const [form, setForm] = useState<LocationMapSettings>(DEFAULTS);
  useEffect(() => { if (data) setForm({ ...DEFAULTS, ...data }); }, [data]);

  const onSave = async () => {
    const src = extractGoogleMapsSrc(form.embed_code);
    if (form.embed_code.trim() && !src) {
      toast.error("Only Google Maps embed iframes are allowed. Paste the full <iframe> from Google Maps.");
      return;
    }
    if (form.is_enabled && !src) {
      toast.error("Add a valid Google Maps embed code before enabling.");
      return;
    }

    const payload: LocationMapSettings = {
      title: form.title.trim().slice(0, 120),
      description: form.description.trim().slice(0, 500),
      embed_code: form.embed_code.trim().slice(0, 4000),
      embed_src: src ?? "",
      is_enabled: form.is_enabled,
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "location_map", value: payload as any }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    toast.success("Location map saved");
    qc.invalidateQueries({ queryKey: ["admin-location-map"] });
    qc.invalidateQueries({ queryKey: ["setting", "location_map"] });
  };

  const onDelete = async () => {
    if (!confirm("Clear the location map? This will hide it from the home page.")) return;
    const cleared = { ...DEFAULTS };
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "location_map", value: cleared as any }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    setForm(cleared);
    toast.success("Location map cleared");
    qc.invalidateQueries({ queryKey: ["admin-location-map"] });
    qc.invalidateQueries({ queryKey: ["setting", "location_map"] });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  const previewSrc = extractGoogleMapsSrc(form.embed_code);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Location Map</h1>
        <p className="text-muted-foreground text-sm">
          Paste the iframe embed code from Google Maps → Share → Embed a map.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <div className="font-medium">Show on home page</div>
              <div className="text-xs text-muted-foreground">Toggle the entire section on or off.</div>
            </div>
            <Switch
              checked={form.is_enabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, is_enabled: v }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Section Title</Label>
            <Input id="title" maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Find Us" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Section Description</Label>
            <Textarea id="desc" maxLength={500} rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Visit our office in Ras Al Khaimah." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="embed">Google Maps Embed Code</Label>
            <Textarea id="embed" maxLength={4000} rows={6}
              className="font-mono text-xs"
              value={form.embed_code}
              onChange={(e) => setForm({ ...form, embed_code: e.target.value })}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>' />
            <p className="text-xs text-muted-foreground">
              Only Google Maps iframes are accepted. Anything else is rejected.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={onDelete}>Delete / Clear</Button>
          </div>
        </CardContent>
      </Card>

      {previewSrc && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="text-sm font-medium">Preview</div>
            <div className="rounded-md overflow-hidden border border-border">
              <iframe
                src={previewSrc}
                title="Map preview"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[360px] border-0 block"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
