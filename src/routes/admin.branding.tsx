import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/branding")({ component: Branding });

const FONT_OPTIONS = [
  "Playfair Display", "Inter", "Space Grotesk", "DM Sans", "Outfit",
  "Figtree", "Sora", "Manrope", "Urbanist", "Lora", "Cormorant Garamond",
  "Libre Baskerville", "Work Sans", "Karla", "Bebas Neue",
];

function Branding() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-setting", "branding"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "branding").maybeSingle();
      return (data?.value ?? {}) as Record<string, any>;
    },
  });

  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: "branding", value: form });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved — refresh to see new fonts");
      qc.invalidateQueries({ queryKey: ["admin-setting", "branding"] });
      qc.invalidateQueries({ queryKey: ["setting", "branding"] });
    }
  };

  const upload = async (file: File) => {
    const path = `branding/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm({ ...form, logo_url: pub.publicUrl });
    toast.success("Logo uploaded");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branding</h1>
        <p className="text-muted-foreground mt-1">Customize logo, colors and typography.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Logo text</Label><Input value={form.logo_text ?? ""} onChange={(e) => setForm({ ...form, logo_text: e.target.value })} /></div>
            <div><Label>Logo tagline</Label><Input value={form.logo_tagline ?? ""} onChange={(e) => setForm({ ...form, logo_tagline: e.target.value })} /></div>
          </div>
          <div>
            <Label>Logo image (optional, overrides text)</Label>
            {form.logo_url && <img src={form.logo_url} alt="" className="mt-2 h-16 object-contain" />}
            <div className="flex gap-2 mt-2">
              <Input value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value || null })} placeholder="Logo URL" />
              <label className="cursor-pointer">
                <Button type="button" variant="outline" asChild><span><Upload className="w-4 h-4 mr-2" />Upload</span></Button>
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Colors</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Primary color (main brand)</Label>
            <div className="flex gap-2 mt-2">
              <input type="color" value={form.primary_color ?? "#16a34a"} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="h-10 w-16 rounded border" />
              <Input value={form.primary_color ?? ""} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Accent color (used sparingly)</Label>
            <div className="flex gap-2 mt-2">
              <input type="color" value={form.accent_color ?? "#dc2626"} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="h-10 w-16 rounded border" />
              <Input value={form.accent_color ?? ""} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Display font (headings)</Label>
            <select className="w-full mt-2 border rounded-md h-9 px-3 bg-background"
              value={form.font_display ?? "Playfair Display"} onChange={(e) => setForm({ ...form, font_display: e.target.value })}>
              {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <Label>Body font</Label>
            <select className="w-full mt-2 border rounded-md h-9 px-3 bg-background"
              value={form.font_sans ?? "Inter"} onChange={(e) => setForm({ ...form, font_sans: e.target.value })}>
              {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save branding"}</Button>
    </div>
  );
}
