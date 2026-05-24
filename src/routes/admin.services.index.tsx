import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { getIcon } from "@/lib/icon-map";
import type { ServiceRow } from "@/lib/site-data";

export const Route = createFileRoute("/admin/services/")({ component: ServicesList });

function ServicesList() {
  const qc = useQueryClient();
  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as ServiceRow[];
    },
  });

  const togglePublished = async (s: ServiceRow) => {
    const { error } = await supabase.from("services").update({ is_published: !s.is_published }).eq("id", s.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-services"] }); qc.invalidateQueries({ queryKey: ["services"] }); }
  };

  const remove = async (s: ServiceRow) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", s.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-services"] }); qc.invalidateQueries({ queryKey: ["services"] }); }
  };

  const createNew = async () => {
    const max = (services?.length ?? 0) * 10 + 10;
    const slug = `new-service-${Date.now()}`;
    const { data, error } = await supabase.from("services").insert({
      slug, title: "New Service", description: "", long_description: "",
      highlights: [], icon: "FileText", sort_order: max, is_published: false,
    }).select().single();
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["admin-services"] }); window.location.href = `/admin/services/${data.id}`; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">Manage the services shown on your website.</p>
        </div>
        <Button onClick={createNew}><Plus className="w-4 h-4 mr-2" />New service</Button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="space-y-2">
          {services?.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <Card key={s.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground truncate">/services/{s.slug}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch checked={s.is_published} onCheckedChange={() => togglePublished(s)} />
                    <span className="w-16">{s.is_published ? "Published" : "Draft"}</span>
                  </div>
                  <Link to="/admin/services/$id" params={{ id: s.id }}>
                    <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => remove(s)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          {services?.length === 0 && <p className="text-muted-foreground">No services yet. Create your first one.</p>}
        </div>
      )}
    </div>
  );
}
