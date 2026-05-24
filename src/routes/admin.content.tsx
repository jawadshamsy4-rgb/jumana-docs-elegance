import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({ component: ContentEditor });

function ContentEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="text-muted-foreground mt-1">Edit homepage hero, about page, and contact details.</p>
      </div>
      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        <TabsContent value="hero"><SettingEditor settingKey="hero" fields={heroFields} /></TabsContent>
        <TabsContent value="about"><SettingEditor settingKey="about" fields={aboutFields} /></TabsContent>
        <TabsContent value="contact"><SettingEditor settingKey="contact" fields={contactFields} /></TabsContent>
      </Tabs>
    </div>
  );
}

type Field = { key: string; label: string; type: "text" | "textarea" | "image" | "list" };

const heroFields: Field[] = [
  { key: "badge", label: "Top badge text", type: "text" },
  { key: "title_line1", label: "Title line 1", type: "text" },
  { key: "title_line2", label: "Title line 2", type: "text" },
  { key: "title_line3", label: "Title line 3", type: "text" },
  { key: "subtitle", label: "Subtitle paragraph", type: "textarea" },
  { key: "cta_primary", label: "Primary button text", type: "text" },
  { key: "cta_secondary_phone", label: "Phone shown on button", type: "text" },
  { key: "image_url", label: "Background image", type: "image" },
];
const aboutFields: Field[] = [
  { key: "label", label: "Eyebrow label", type: "text" },
  { key: "heading", label: "Main heading", type: "text" },
  { key: "intro", label: "Intro paragraph", type: "textarea" },
  { key: "body", label: "Body paragraph", type: "textarea" },
  { key: "closing", label: "Closing paragraph", type: "textarea" },
  { key: "founder_name", label: "Founder name", type: "text" },
  { key: "founder_title", label: "Founder title", type: "text" },
  { key: "values", label: "Values (one per line)", type: "list" },
  { key: "image_url", label: "About image", type: "image" },
];
const contactFields: Field[] = [
  { key: "heading", label: "Page heading", type: "text" },
  { key: "subtitle", label: "Page subtitle", type: "textarea" },
  { key: "phone1", label: "Primary phone", type: "text" },
  { key: "phone2", label: "Secondary phone", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "whatsapp", label: "WhatsApp number (digits only, with country code)", type: "text" },
];

function SettingEditor({ settingKey, fields }: { settingKey: string; fields: Field[] }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-setting", settingKey],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", settingKey).maybeSingle();
      return (data?.value ?? {}) as Record<string, any>;
    },
  });
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: settingKey, value: form });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-setting", settingKey] });
      qc.invalidateQueries({ queryKey: ["setting", settingKey] });
    }
  };

  const upload = async (key: string, file: File) => {
    const path = `${settingKey}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm({ ...form, [key]: pub.publicUrl });
    toast.success("Uploaded");
  };

  return (
    <Card className="mt-4">
      <CardHeader><CardTitle className="capitalize">{settingKey} settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.type === "text" && <Input value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
            {f.type === "textarea" && <Textarea rows={4} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
            {f.type === "list" && (
              <Textarea rows={6} value={(form[f.key] ?? []).join("\n")}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
            )}
            {f.type === "image" && (
              <>
                {form[f.key] && <img src={form[f.key]} alt="" className="mt-2 rounded-lg max-h-48 object-cover" />}
                <div className="flex gap-2 mt-2">
                  <Input value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value || null })} placeholder="Image URL or upload" />
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" asChild><span><Upload className="w-4 h-4 mr-2" />Upload</span></Button>
                    <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(f.key, e.target.files[0])} />
                  </label>
                </div>
              </>
            )}
          </div>
        ))}
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </CardContent>
    </Card>
  );
}
