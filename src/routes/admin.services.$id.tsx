import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { ICON_NAMES, getIcon } from "@/lib/icon-map";
import type { ServiceRow } from "@/lib/site-data";

export const Route = createFileRoute("/admin/services/$id")({ component: EditService });

function EditService() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: service } = useQuery({
    queryKey: ["admin-service", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("id", id).single();
      if (error) throw error;
      return data as ServiceRow;
    },
  });

  const [form, setForm] = useState<ServiceRow | null>(null);
  const [highlightsText, setHighlightsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (service) {
      setForm(service);
      setHighlightsText((service.highlights ?? []).join("\n"));
    }
  }, [service]);

  if (!form) return <p className="text-muted-foreground">Loading…</p>;

  const update = (patch: Partial<ServiceRow>) => setForm({ ...form, ...patch });

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const cleanName = file.name.replace(/[^\w.-]/g, "_").slice(0, 120) || "image";
      const path = `services/${form.slug || form.id}-${Date.now()}-${cleanName}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: true });
      if (upErr) { toast.error(upErr.message); return; }
      const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      const { error: updErr } = await supabase.from("services").update({ image_url: publicUrl }).eq("id", form.id);
      if (updErr) { toast.error(updErr.message); return; }
      update({ image_url: publicUrl });
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["admin-service", id] });
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["service", form.slug] });
      toast.success("Image updated");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    const highlights = highlightsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("services").update({
      slug: form.slug, title: form.title, description: form.description,
      long_description: form.long_description, highlights, icon: form.icon,
      image_url: form.image_url, sort_order: form.sort_order, is_published: form.is_published,
    }).eq("id", form.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["service", form.slug] });
    }
  };

  const Icon = getIcon(form.icon);

  return (
    <div className="space-y-6">
      <Link to="/admin/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> All services
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{form.title || "Untitled service"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={(v) => update({ is_published: v })} /><span className="text-sm">{form.is_published ? "Published" : "Draft"}</span></div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </div>

      <Card><CardContent className="p-6 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => update({ title: e.target.value })} /></div>
          <div><Label>URL slug</Label><Input value={form.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Icon</Label>
            <select className="w-full mt-2 border rounded-md h-9 px-3 bg-background"
              value={form.icon} onChange={(e) => update({ icon: e.target.value })}>
              {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => update({ sort_order: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Short description (card)</Label><Textarea rows={3} value={form.description} onChange={(e) => update({ description: e.target.value })} /></div>
        <div><Label>Long description (detail page)</Label><Textarea rows={5} value={form.long_description} onChange={(e) => update({ long_description: e.target.value })} /></div>
        <div>
          <Label>Highlights (one per line)</Label>
          <Textarea rows={6} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder="Bullet 1&#10;Bullet 2" />
        </div>
        <div>
          <Label>Detail page image</Label>
          {form.image_url && <img src={form.image_url} alt="" className="mt-2 rounded-lg max-h-48 object-cover" />}
          <div className="flex gap-2 items-center mt-2">
            <Input value={form.image_url ?? ""} onChange={(e) => update({ image_url: e.target.value || null })} placeholder="Image URL or upload below" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploading} asChild>
                <span><Upload className="w-4 h-4 mr-2" />{uploading ? "Uploading…" : "Upload"}</span>
              </Button>
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
            </label>
          </div>
        </div>
      </CardContent></Card>
    </div>
  );
}
